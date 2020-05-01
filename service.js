import './helpers/playerControls'
import { skipToPrevious } from './helpers/playerControls';
import { addEventListener, play, pause, stop, skipToNext, seekTo } from 'react-native-track-player'

export default async function () {
    addEventListener('remote-play', () => play());

    addEventListener('remote-pause', () => pause());

    addEventListener('remote-stop', () => stop());

    addEventListener('remote-seek', ({ position }) => seekTo(position));

    addEventListener('remote-next', () => skipToNext());

    addEventListener('remote-previous', () => skipToPrevious());
};