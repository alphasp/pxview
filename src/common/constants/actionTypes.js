import { defineAction } from 'redux-define';
import { REQUEST, SUCCESS, FAILURE, CLEAR } from './stateConstants';

const appNamespace = defineAction('PIXIV');

export const RECOMMENDED_ILLUSTS = defineAction('RECOMMENDED_ILLUSTS',
	[REQUEST, SUCCESS, FAILURE, CLEAR], appNamespace);