import { defineAction } from 'redux-define';
import { REQUEST, SUCCESS, FAILURE, CLEAR, CLEAR_ALL } from './stateConstants';

const appNamespace = defineAction('PIXIV');

export const RECOMMENDED_ILLUSTS = defineAction('RECOMMENDED_ILLUSTS',
	[REQUEST, SUCCESS, FAILURE, CLEAR], appNamespace);

export const RECOMMENDED_MANGAS = defineAction('RECOMMENDED_MANGAS',
	[REQUEST, SUCCESS, FAILURE, CLEAR], appNamespace);	

export const RELATED_ILLUSTS = defineAction('RELATED_ILLUSTS',
	[REQUEST, SUCCESS, FAILURE, CLEAR], appNamespace);	

export const ILLUST_COMMENTS = defineAction('ILLUST_COMMENTS',
	[REQUEST, SUCCESS, FAILURE, CLEAR], appNamespace);	

export const RANKING = defineAction('RANKING',
	[REQUEST, SUCCESS, FAILURE, CLEAR, CLEAR_ALL], appNamespace);	

export const USER_DETAIL = defineAction('USER_DETAIL',
	[REQUEST, SUCCESS, FAILURE, CLEAR, CLEAR_ALL], appNamespace);	
