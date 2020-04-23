import { durationTextToSeconds } from '../helpers/utils'

/* GET YOUTUBE TRACK */

const BASE_URL = 'https://www.youtube.com'

const DECRYPTION_SIGNATURE_FUNCTION_REGEX =
    /([\w$]+)\s*=\s*function\((\w+)\)\{\s*\2=\s*\2\.split\(\"\"\)\s*;/
const DECRYPTION_SIGNATURE_FUNCTION_REGEX_2 =
    /\b([\w$]{2})\s*=\s*function\((\w+)\)\{\s*\2=\s*\2\.split\(\"\"\)\s*;/
const DECRYPTION_AKAMAIZED_STRING_REGEX =
    /yt\.akamaized\.net\/\)\s*\|\|\s*.*?\s*c\s*&&\s*d\.set\([^,]+\s*,\s*(:encodeURIComponent\s*\()([a-zA-Z0-9$]+)\(/
const DECRYPTION_AKAMAIZED_SHORT_STRING_REGEX =
    /\bc\s*&&\s*d\.set\([^,]+\s*,\s*(:encodeURIComponent\s*\()([a-zA-Z0-9$]+)\(/

function getDecryptionFuncName(playerCode) {
    const decryptionFuncNameRegexes = [
        DECRYPTION_SIGNATURE_FUNCTION_REGEX_2,
        DECRYPTION_SIGNATURE_FUNCTION_REGEX,
        DECRYPTION_AKAMAIZED_SHORT_STRING_REGEX,
        DECRYPTION_AKAMAIZED_STRING_REGEX
    ]

    let funcName
    for (let regex of decryptionFuncNameRegexes) {
        funcName = playerCode.match(regex)[1]
        if (funcName !== undefined)
            return funcName;
    }

    return undefined
}

function loadDecryptionCode(playerCode) {
    const decryptionFunctionName = getDecryptionFuncName(playerCode);

    let functionPattern = new RegExp("("
        + decryptionFunctionName.replace("$", "\\$")
        + "=function\\([a-zA-Z0-9_]+\\)\\{(.+?)\\})");

    const decryptionFunction = "var " + playerCode.match(functionPattern)[1] + ";";
    const innerDecryptionFunction = playerCode.match(functionPattern)[2]

    const helperObjectName =
        decryptionFunction.match(/;([A-Za-z0-9_\$]{2})\...\(/)[1];

    let helperPattern = new RegExp(
        "(var " + helperObjectName.replace("$", "\\$") + "=(\\{.+?\\}\\});)");

    let innerHelperObject =
        playerCode.replace(/(\r\n|\n|\r)/gm, "").match(helperPattern)[2];

    const decrypt = Function('a', 'var ' + helperObjectName + ' = (' + innerHelperObject + '); ' + innerDecryptionFunction)

    return decrypt;
}



function parsePlayerConfig(data) {
    const config = data.match(/ytplayer.config = (.*?});/)[1]
    try {
        return JSON.parse(config)
    } catch(e) {
        console.error('error while parsing player config: ' + e)
        console.log(data)
    }
}

async function getVideoPage(videoId) {
    return fetch(BASE_URL + '/watch?v=' + videoId, { headers: DESKTOP_UA })
        .then(data => data.text())
}

async function getPlayerCode(playerConfig) {
    return fetch(BASE_URL + playerConfig.assets.js)
        .then(data => data.text())
}

function _getBestAudioTrack(playerResponse) {
    return playerResponse
        .streamingData.adaptiveFormats
        .filter(f => f.mimeType.startsWith('audio'))
        .sort((a, b) => b.itag - a.itag)
    [0]
}

function _getThumbnailUrl(playerResponse) {
    const thumbnails = playerResponse
        .videoDetails
        .thumbnail
        .thumbnails
    return thumbnails[thumbnails.length - 1]
        .url
}

function compatParseMap(input) {
    let map = {}
    for (let arg of input.split("&")) {
        let splitArg = arg.split("=");
        if (splitArg.length > 1) {
            map[splitArg[0]] = decodeURIComponent(splitArg[1], "UTF-8");
        } else {
            map[splitArg[0]] = "";
        }
    }
    return map;
}

export async function getTrackFromYT(videoId) {
    const videoPage = await getVideoPage(videoId)
    const playerConfig = parsePlayerConfig(videoPage)
    const playerResponse = JSON.parse(playerConfig.args.player_response)
    const artwork = { uri: _getThumbnailUrl(playerResponse) }
    const bestAudioTrack = _getBestAudioTrack(playerResponse)

    const { initialData, xsrfToken } = parseInitialData(videoPage)
    const { items, continuation, clickTrackingParams } = parseRelated(initialData)

    let url
    if (bestAudioTrack['url'] !== undefined)
        url = bestAudioTrack['url']
    else {
        const playerCode = await getPlayerCode(playerConfig)
        const decrypt = loadDecryptionCode(playerCode)
        const streamCipher = bestAudioTrack['cipher']
        const cipher = compatParseMap(streamCipher)
        url = cipher['url'] + "&" + cipher['sp'] + "=" + decrypt(cipher['s'])
    }

    return {
        url: { uri: url },
        contentType: bestAudioTrack.mimeType,
        duration: bestAudioTrack.approxDurationMs / 1000,
        artwork: artwork,
        related: {
            results: items,
            continuationInfos: {
                continuation: continuation,
                itct: clickTrackingParams,
                session_token: xsrfToken,
            }
        }
    }
}

/* YOUTUBE SEARCH */

const DESKTOP_UA = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:75.0) Gecko/20100101 Firefox/75.0',
    'X-YouTube-Client-Name': '1',
    'X-YouTube-Client-Version': '2.20200214.04.00'
}

const DESKTOP_BASE_URL = 'https://www.youtube.com/'

function parseInitialData(pageContent) {
    const xsrfTokenPattern = /"XSRF_TOKEN":"(.*?)"/
    const ytInitialDataPattern = /window\[\"ytInitialData\"\] = (.*);\n/
    let ytInitialDataRaw, xsrfToken

    try {
        ytInitialDataRaw = pageContent.match(ytInitialDataPattern)[1]
    } catch (e) {
        console.error('cannot find the patterns for related videos (ytInitialDataRaw): ' + e)
        console.log(pageContent)
    }

    try {
        xsrfToken = pageContent.match(xsrfTokenPattern)[1]
    } catch (e) {
        console.error('cannot find the patterns for related videos (xsrfToken):' + e)
    }

    try {
        return {
            initialData: JSON.parse(ytInitialDataRaw),
            xsrfToken: xsrfToken
        }
    } catch (e) {
        console.error('error in parseInitialData: ' + e)
        console.log(ytInitialDataRaw)
    }
}

function parseVideoRenderer(videoRenderer) {
    try {
        const thumbnails = videoRenderer.thumbnail.thumbnails
        const length = durationTextToSeconds(videoRenderer.lengthText.simpleText)
        const title = videoRenderer.title.simpleText || videoRenderer.title.runs[0].text
        const owner = videoRenderer.ownerText ? videoRenderer.ownerText.runs[0].text : videoRenderer.shortBylineText.runs[0].text
        return ({
            videoId: videoRenderer.videoId,
            artwork: { uri: thumbnails[thumbnails.length - 1].url },
            title: title,
            artist: owner,
            duration: length,
            lengthText: videoRenderer.lengthText.simpleText
        })
    } catch (error) {
    }
}

function itemSectionRendererToTrackList(itemSectionRendererContent, videoRendererObjectName = 'videoRenderer') {
    return itemSectionRendererContent
        .filter(d => d[videoRendererObjectName] !== undefined)
        .map((item) => {
            const videoRenderer = item[videoRendererObjectName]
            return parseVideoRenderer(videoRenderer)
        })
        .filter(item => item !== undefined)
}

export async function ytSearch(query) {
    var pageContent
    await fetch(DESKTOP_BASE_URL + 'results?search_query=' + encodeURIComponent(query), {
        headers: DESKTOP_UA
    })
        .then(data => data.text())
        .then(data => { pageContent = data })

    const { initialData, xsrfToken } = parseInitialData(pageContent)

    const { items, continuation, clickTrackingParams } = parseSearch(initialData)

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

function parseSearch(initialData) {

    try {
        const itemSectionRenderer = initialData.contents
            .twoColumnSearchResultsRenderer
            .primaryContents
            .sectionListRenderer
            .contents.filter(c => c.itemSectionRenderer.continuations !== undefined)[0]
            .itemSectionRenderer

        const { continuation, clickTrackingParams } = itemSectionRenderer
            .continuations[0]
            .nextContinuationData

        var items = itemSectionRendererToTrackList(itemSectionRenderer.contents)

        return { items, continuation, clickTrackingParams }
    } catch (e) {
        console.error(e)
        console.log(initialData)
    }
}

export async function relatedVideos(videoId) {
    var pageContent
    await fetch(DESKTOP_BASE_URL + 'watch?v=' + videoId, {
        headers: DESKTOP_UA
    })
        .then(data => data.text())
        .then(data => { pageContent = data })

    const { initialData, xsrfToken } = parseInitialData(pageContent)

    const { items, continuation, clickTrackingParams } = parseRelated(initialData)

    return {
        results: items,
        continuationInfos: {
            continuation: continuation,
            itct: clickTrackingParams,
            session_token: xsrfToken
        }
    }
}

function parseRelated(initialData) {
    const itemSectionRenderer = initialData.contents
        .twoColumnWatchNextResults
        .secondaryResults
        .secondaryResults

    const { continuation, clickTrackingParams } = itemSectionRenderer
        .continuations[0]
        .nextContinuationData

    var items = itemSectionRendererToTrackList(itemSectionRenderer.results, 'compactVideoRenderer')

    const nextVideoRenderer = itemSectionRenderer
        .results[0]
        .compactAutoplayRenderer
        .contents[0]
        .compactVideoRenderer

    items.unshift(parseVideoRenderer(nextVideoRenderer))

    return { items, continuation, clickTrackingParams }
}

export async function ytNextPage(continuationInfos, type) {
    let ressourceName, sectionName, videoRendererObjectName
    switch (type) {
        case 'SEARCH':
            ressourceName = 'results?search_query=' + encodeURIComponent(continuationInfos.query) + '&'
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
            break;
    }

    const url = DESKTOP_BASE_URL + ressourceName
        + 'pbj=1&ctoken=' + encodeURIComponent(continuationInfos.continuation)
        + '&continuation=' + encodeURIComponent(continuationInfos.continuation)
        + '&itct=' + encodeURIComponent(continuationInfos.itct)
    const body = 'session_token=' + encodeURIComponent(continuationInfos.session_token)

    let dataJson
    await fetch(url, {
        method: "POST",
        headers: DESKTOP_UA,
        body: body
    })
        .then(data => data.json())
        .then(data => { dataJson = data })
        .catch(console.error)

    const xsrfToken = dataJson[1]['xsrf_token']

    const sectionContinuation = dataJson[1].response.continuationContents[sectionName[0]]
    const items = itemSectionRendererToTrackList(sectionContinuation[sectionName[1]], videoRendererObjectName)

    const nextContinuationData = sectionContinuation
        .continuations[0]
        .nextContinuationData
    const { continuation, clickTrackingParams } = nextContinuationData

    return {
        results: items,
        continuationInfos: {
            continuation: continuation,
            itct: clickTrackingParams,
            session_token: xsrfToken
        }
    }
}

export async function ytSearchNextPage(query, continuationInfos) {
    const continuationInfosBis = { ...continuationInfos, query: query }
    return ytNextPage(continuationInfosBis, 'SEARCH')
}

/* RELATED VIDEOS */

export async function ytRelatedNextPage(continuationInfos) {
    return ytNextPage(continuationInfos, 'RELATED')
}