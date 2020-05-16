import { v4 as uuid } from 'uuid';

import { durationTextToSeconds } from '../helpers/utils';
import { JOTrack, ResultJOTrack } from '../helpers/types';

/* GET YOUTUBE TRACK */

const BASE_URL = 'https://www.youtube.com';

const DECRYPTION_SIGNATURE_FUNCTION_REGEX =
    /([\w$]+)\s*=\s*function\((\w+)\)\{\s*\2=\s*\2\.split\(\"\"\)\s*;/;
const DECRYPTION_SIGNATURE_FUNCTION_REGEX_2 =
    /\b([\w$]{2})\s*=\s*function\((\w+)\)\{\s*\2=\s*\2\.split\(\"\"\)\s*;/;
const DECRYPTION_AKAMAIZED_STRING_REGEX =
    /yt\.akamaized\.net\/\)\s*\|\|\s*.*?\s*c\s*&&\s*d\.set\([^,]+\s*,\s*(:encodeURIComponent\s*\()([a-zA-Z0-9$]+)\(/;
const DECRYPTION_AKAMAIZED_SHORT_STRING_REGEX =
    /\bc\s*&&\s*d\.set\([^,]+\s*,\s*(:encodeURIComponent\s*\()([a-zA-Z0-9$]+)\(/;

function getDecryptionFuncName(playerCode: string) {
    const decryptionFuncNameRegexes = [
        DECRYPTION_SIGNATURE_FUNCTION_REGEX_2,
        DECRYPTION_SIGNATURE_FUNCTION_REGEX,
        DECRYPTION_AKAMAIZED_SHORT_STRING_REGEX,
        DECRYPTION_AKAMAIZED_STRING_REGEX
    ];

    let funcName
    for (let regex of decryptionFuncNameRegexes) {
        funcName = playerCode.match(regex)![1]
        if (funcName !== undefined)
            return funcName;
    }

    console.error('decryption function name not found');
    return ''
}

function loadDecryptionCode(playerCode: string): Function {
    const decryptionFunctionName = getDecryptionFuncName(playerCode);

    let functionPattern = new RegExp("("
        + decryptionFunctionName.replace("$", "\\$")
        + "=function\\([a-zA-Z0-9_]+\\)\\{(.+?)\\})");

    const playerCodeMatch = playerCode.match(functionPattern);
    let decryptionFunction, innerDecryptionFunction;

    if (playerCodeMatch && playerCodeMatch.length >= 2) {
        decryptionFunction = "var " + playerCodeMatch[1] + ";";
        innerDecryptionFunction = playerCodeMatch[2];
    } else {
        console.error('decryption function not found');
        return (a: string): string => a;
    }

    const helperObjectNameMatch = decryptionFunction.match(/;([A-Za-z0-9_\$]{2})\...\(/);
    let helperObjectName;

    if (helperObjectNameMatch && helperObjectNameMatch.length >= 2) {
        helperObjectName = helperObjectNameMatch[1];
    } else {
        console.error('helper object name not found');
        return (a: string): string => a;
    }

    let helperPattern = new RegExp(
        "(var " + helperObjectName.replace("$", "\\$") + "=(\\{.+?\\}\\});)");

    const innerHelperObjectMatch = playerCode.replace(/(\r\n|\n|\r)/gm, "")
        .match(helperPattern);

    let innerHelperObject;

    if (innerHelperObjectMatch && innerHelperObjectMatch.length >= 2) {
        innerHelperObject = innerHelperObjectMatch[2];
    } else {
        console.error('helper object not found');
    }

    const decrypt = Function(
        'a',
        'var '
        + helperObjectName
        + ' = ('
        + innerHelperObject
        + '); '
        + innerDecryptionFunction
    );

    return decrypt;
}



function parsePlayerConfig(data: string) {
    const playerConfigParsed = data.match(/ytplayer.config = (.*?});/);
    const config = playerConfigParsed ? playerConfigParsed[1] : '';

    try {
        return JSON.parse(config);
    } catch (e) {
        console.log(data);
    }

    throw "error while parsing player config";
}

async function getVideoPage(videoId: string) {
    return fetch(BASE_URL + '/watch?v=' + videoId, { headers: DESKTOP_UA })
        .then(data => data.text());
}

interface PlayerConfig {
    assets: {
        js: string
    }
}

async function getPlayerCode(playerConfig: PlayerConfig) {
    return fetch(BASE_URL + playerConfig.assets.js)
        .then(data => data.text());
}

interface YtFormat {
    mimeType: string,
    itag: number,
    approxDurationMs: number,
    cipher?: string,
    url?: string
}

interface playerResponse {
    streamingData: {
        adaptiveFormats: YtFormat[]
    },
    videoDetails: {
        thumbnail: {
            thumbnails: {
                url: string
            }[]
        }
    }
}

function _getBestAudioTrack(playerResponse: playerResponse): YtFormat {
    return playerResponse
        .streamingData.adaptiveFormats
        .filter(f => f.mimeType.startsWith('audio'))
        .sort((a, b) => b.itag - a.itag)
    [0]
}

function _getThumbnailUrl(playerResponse: playerResponse) {
    const thumbnails = playerResponse
        .videoDetails
        .thumbnail
        .thumbnails;

    return thumbnails[thumbnails.length - 1]
        .url;
}

function compatParseMap(input: string): Cipher {
    let map = Object()
    for (let arg of input.split("&")) {
        let splitArg = arg.split("=");
        if (splitArg.length > 1) {
            map[splitArg[0]] = decodeURIComponent(splitArg[1]);
        } else {
            map[splitArg[0]] = "";
        }
    }
    return <Cipher>map;
}

interface Cipher {
    url: string,
    sp: string,
    s: string
}

export async function getTrackFromYT(videoId: string) {
    if (!videoId || !videoId.length) {
        console.error('videoId cannot be empty')
    }

    const videoPage = await getVideoPage(videoId);
    const playerConfig = parsePlayerConfig(videoPage);
    const playerResponse = JSON.parse(playerConfig.args.player_response);
    const artwork = { uri: _getThumbnailUrl(playerResponse) };
    const bestAudioTrack = _getBestAudioTrack(playerResponse);

    const { initialData, xsrfToken } = parseInitialData(videoPage);
    const { items, continuation, clickTrackingParams } = parseRelated(initialData);

    let url;
    if (bestAudioTrack['url'] !== undefined) {
        console.log('got an url')
        url = bestAudioTrack['url'];
    } else if (bestAudioTrack['cipher'] !== undefined) {
        console.log('got a cipher')
        const playerCode = await getPlayerCode(playerConfig);
        const decrypt = loadDecryptionCode(playerCode);
        const streamCipher = bestAudioTrack['cipher'];
        const cipher = compatParseMap(streamCipher);
        url = cipher['url'] + "&" + cipher['sp'] + "=" + decrypt(cipher['s']);
    } else {
        console.log('no track found')
        throw "no track found!";
    }

    let track: {
        url: { uri: string },
        contentType: string,
        artwork: { uri: string },
        related: {
            results: ResultJOTrack[],
            continuationInfos: {
                continuation: string,
                itct: string,
                session_token: string,
            }
        },
        duration?: number
    } = {
        url: { uri: url },
        contentType: bestAudioTrack.mimeType,
        artwork: artwork,
        related: {
            results: items,
            continuationInfos: {
                continuation: continuation,
                itct: clickTrackingParams,
                session_token: xsrfToken,
            }
        }
    };

    if (!isNaN(bestAudioTrack.approxDurationMs)) {
        track.duration = bestAudioTrack.approxDurationMs / 1000;
    }

    return track;
}

/* YOUTUBE SEARCH */

const DESKTOP_UA = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:75.0) Gecko/20100101 Firefox/75.0',
    'X-YouTube-Client-Name': '1',
    'X-YouTube-Client-Version': '2.20200214.04.00'
}

const DESKTOP_BASE_URL = 'https://www.youtube.com/'

function parseInitialData(pageContent: string) {
    const xsrfTokenPattern = /"XSRF_TOKEN":"(.*?)"/
    const ytInitialDataPattern = /window\[\"ytInitialData\"\] = (.*);\n/
    let ytInitialDataRaw: string
    let xsrfToken: string

    const resultsYtInitialDataRaw: RegExpMatchArray | null = pageContent.match(ytInitialDataPattern)
    if (resultsYtInitialDataRaw !== null && resultsYtInitialDataRaw.length >= 2)
        ytInitialDataRaw = resultsYtInitialDataRaw[1]
    else {
        console.error('cannot find the patterns for related videos (ytInitialDataRaw)')
        console.log(pageContent)
        return {
            initialData: '',
            xsrfToken: ''
        }
    }

    const resultsXsrfToken: RegExpMatchArray | null = pageContent.match(xsrfTokenPattern)
    if (resultsXsrfToken !== null && resultsXsrfToken.length >= 2) {
        xsrfToken = resultsXsrfToken[1]
    } else {
        console.error('cannot find the patterns for related videos (xsrfToken)')
        return {
            initialData: '',
            xsrfToken: ''
        }
    }

    return {
        initialData: JSON.parse(ytInitialDataRaw),
        xsrfToken: xsrfToken
    }
}

type Runs = { text: string }[]

interface VideoRenderer {
    thumbnail: {
        thumbnails: any
    },
    lengthText: {
        simpleText: string
    },
    title: {
        simpleText?: string
        runs: Runs
    },
    ownerText: {
        runs: Runs
    },
    shortBylineText: {
        runs: Runs
    },
    videoId: string
}

function parseVideoRenderer(videoRenderer: VideoRenderer): ResultJOTrack {
    const thumbnails = videoRenderer.thumbnail.thumbnails;
    let length = 0, title = '', lengthText = '';
    try {
        lengthText = videoRenderer.lengthText.simpleText;
    } catch (err) {
        console.log('Cannot get length text');
        console.log(videoRenderer);
    }
    try {
        length = durationTextToSeconds(videoRenderer.lengthText.simpleText);
    } catch (err) {
        console.log('Cannot get length');
        console.log(videoRenderer);
    }
    try {
        title = videoRenderer.title.simpleText || videoRenderer.title.runs[0].text;
    } catch (err) {
        console.log('Cannot get title');
        console.log(videoRenderer);
    }
    const owner = videoRenderer.ownerText
        ? videoRenderer.ownerText.runs[0].text
        : videoRenderer.shortBylineText.runs[0].text;

    return ({
        videoId: videoRenderer.videoId,
        artwork: { uri: thumbnails[thumbnails.length - 1].url },
        title: title,
        artist: owner,
        duration: length,
        lengthText: lengthText
    })
}

function itemSectionRendererToTrackList(
    itemSectionRendererContent: any,
    videoRendererObjectName: string = 'videoRenderer'
): ResultJOTrack[] {
    return itemSectionRendererContent
        .filter((d: any) => d[videoRendererObjectName] !== undefined)
        .map((item: any) => {
            const videoRenderer = item[videoRendererObjectName]
            return parseVideoRenderer(videoRenderer)
        })
        .filter((item: any) => item !== undefined);
}

export async function ytSearch(query: string) {
    const data = await fetch(DESKTOP_BASE_URL + 'results?search_query=' + encodeURIComponent(query), {
        headers: DESKTOP_UA
    })
        .then(data => data.text());

    const pageContent = data;

    const { initialData, xsrfToken } = parseInitialData(pageContent);

    const { items, continuation, clickTrackingParams } = parseSearch(initialData);

    return {
        results: items,
        continuationInfos: {
            continuation: continuation,
            itct: clickTrackingParams,
            session_token: xsrfToken,
            query: query
        }
    }
}

interface YTNextContinuationData {
    continuation: string,
    clickTrackingParams: string,
    query?: string
}

export interface ContinuationInfos {
    continuation: string,
    itct: string,
    query?: string,
    session_token: string
}

interface InitialDataSearch {
    contents: {
        twoColumnSearchResultsRenderer: {
            primaryContents: {
                sectionListRenderer: {
                    contents: {
                        itemSectionRenderer: {
                            continuations: {
                                nextContinuationData: YTNextContinuationData
                            }[],
                            contents: any[]
                        }
                    }[]
                }
            }
        }
    }
}

function parseSearch(initialData: InitialDataSearch) {

    const itemSectionRenderer = initialData.contents
        .twoColumnSearchResultsRenderer
        .primaryContents
        .sectionListRenderer
        .contents.filter(c => c.itemSectionRenderer.continuations !== undefined)[0]
        .itemSectionRenderer;

    const { continuation, clickTrackingParams } = itemSectionRenderer
        .continuations[0]
        .nextContinuationData;

    var items = itemSectionRendererToTrackList(itemSectionRenderer.contents);

    return { items, continuation, clickTrackingParams }
}

export async function relatedVideos(videoId: string): Promise<{
    results: ResultJOTrack[],
    continuationInfos: ContinuationInfos
}> {
    const data = await fetch(DESKTOP_BASE_URL + 'watch?v=' + videoId, {
        headers: DESKTOP_UA
    })
        .then(data => data.text());

    const pageContent: string = data;

    const { initialData, xsrfToken } = parseInitialData(pageContent);

    const { items, continuation, clickTrackingParams } = parseRelated(initialData);

    return {
        results: items,
        continuationInfos: {
            continuation: continuation,
            itct: clickTrackingParams,
            session_token: xsrfToken
        }
    }
}

interface InitialDataRelated {
    contents: {
        twoColumnWatchNextResults: {
            secondaryResults: {
                secondaryResults: {
                    continuations: {
                        nextContinuationData: YTNextContinuationData
                    }[],
                    results: any[]
                }
            }
        }
    }
}

function parseRelated(initialData: InitialDataRelated): {
    items: ResultJOTrack[],
    continuation: string,
    clickTrackingParams: string
} {
    const itemSectionRenderer = initialData.contents
        .twoColumnWatchNextResults
        .secondaryResults
        .secondaryResults;

    const { continuation, clickTrackingParams } = itemSectionRenderer
        .continuations[0]
        .nextContinuationData;

    var items = itemSectionRendererToTrackList(itemSectionRenderer.results, 'compactVideoRenderer');

    const nextVideoRenderer = itemSectionRenderer
        .results[0]
        .compactAutoplayRenderer
        .contents[0]
        .compactVideoRenderer

    items.unshift(parseVideoRenderer(nextVideoRenderer));

    return { items, continuation, clickTrackingParams }
}

export function ytNextPage(
    continuationInfos: ContinuationInfos,
    type: string
): Promise<{
    results: ResultJOTrack[],
    continuationInfos: ContinuationInfos
}> {

    let ressourceName, sectionName: string[], videoRendererObjectName: string;
    switch (type) {
        case 'SEARCH':
            ressourceName = 'results?search_query='
                + encodeURIComponent(continuationInfos.query!)
                + '&'
            sectionName = ['itemSectionContinuation', 'contents']
            videoRendererObjectName = 'videoRenderer'
            break;
        case 'RELATED':
            ressourceName = 'related_ajax?'
            sectionName = ['watchNextSecondaryResultsContinuation', 'results']
            videoRendererObjectName = 'compactVideoRenderer'
            break;
        default:
            console.error('No type specified')
            sectionName = ['', '']
            break;
    }

    const url = DESKTOP_BASE_URL + ressourceName
        + 'pbj=1&ctoken='
        + encodeURIComponent(continuationInfos.continuation)
        + '&continuation='
        + encodeURIComponent(continuationInfos.continuation)
        + '&itct='
        + encodeURIComponent(continuationInfos.itct);

    const body = 'session_token='
        + encodeURIComponent(continuationInfos.session_token);

    return fetch(url, {
        method: "POST",
        headers: DESKTOP_UA,
        body: body
    })
        .then(data => data.json())
        .then(dataJson => {

            const xsrfToken = dataJson[1]['xsrf_token'];

            const sectionContinuation = dataJson[1]
                .response
                .continuationContents[sectionName[0]];

            const items = itemSectionRendererToTrackList(
                sectionContinuation[sectionName[1]],
                videoRendererObjectName
            );

            const nextContinuationData = sectionContinuation
                .continuations[0]
                .nextContinuationData;

            const { continuation, clickTrackingParams } = nextContinuationData;

            return {
                results: items,
                continuationInfos: {
                    continuation: continuation,
                    itct: clickTrackingParams,
                    session_token: xsrfToken
                }
            }
        })
        .catch(error => {
            console.error(error);
            return {
                results: [],
                continuationInfos: {
                    continuation: '',
                    itct: '',
                    session_token: ''
                }
            }
        });

}

export async function ytSearchNextPage(
    query: string,
    continuationInfos: ContinuationInfos
) {
    const continuationInfosBis = { ...continuationInfos, query: query }
    return ytNextPage(continuationInfosBis, 'SEARCH')
}

/* RELATED VIDEOS */

export async function ytRelatedNextPage(continuationInfos: ContinuationInfos) {
    return ytNextPage(continuationInfos, 'RELATED');
}

export async function getTrack(track: JOTrack, cache: { [k: string]: JOTrack }) {
    let ytTrack;
    if (cache[track.videoId] === undefined || cache[track.videoId].url === undefined) {
        ytTrack = await getTrackFromYT(track.videoId);
    } else {
        ytTrack = cache[track.videoId];
    }

    return {
        ...track,
        ...ytTrack,
        id: uuid(),
    }
}