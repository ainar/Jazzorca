import './helpers/playerControls'
import { play, pause, stop, skipToNext, skipToPrevious, seekTo } from './helpers/playerControls';
import { addEventListener } from 'react-native-track-player'

export default async function () {
    addEventListener('remote-play', () => play());

    addEventListener('remote-pause', () => pause());

    addEventListener('remote-stop', () => stop());

    addEventListener('remote-seek', ({ position }) => seekTo(position));

    addEventListener('remote-next', () => skipToNext());

    addEventListener('remote-previous', () => skipToPrevious());
};