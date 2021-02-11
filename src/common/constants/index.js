export const THEME_TYPES = {
  LIGHT: 'LIGHT',
  DARK: 'DARK',
};

export const BOOKMARK_TYPES = {
  PUBLIC: 'PUBLIC',
  PRIVATE: 'PRIVATE',
};

export const FOLLOWING_TYPES = {
  PUBLIC: 'PUBLIC',
  PRIVATE: 'PRIVATE',
};

export const WORK_TYPES = {
  IMAGE: 'IMAGE',
  NOVEL: 'NOVEL',
};

export const MODAL_TYPES = {
  FOLLOW: 'FOLLOW',
  BOOKMARK_ILLUST: 'BOOKMARK_ILLUST',
  BOOKMARK_NOVEL: 'BOOKMARK_NOVEL',
  NOVEL_SETTINGS: 'NOVEL_SETTINGS',
  READING_DIRECTION_SETTINGS: 'READING_DIRECTION_SETTINGS',
  INITIAL_SCREEN_SETTINGS: 'INITIAL_SCREEN_SETTINGS',
  LANGUAGE_SETTINGS: 'LANGUAGE_SETTINGS',
  SAVE_IMAGE_FILE_NAME_FORMAT: 'SAVE_IMAGE_FILE_NAME_FORMAT',
  LIKE_BUTTON_SETTINGS: 'LIKE_BUTTON_SETTINGS',
  SIGNUP: 'SIGNUP',
};

export const RANKING_TYPES = {
  ILLUST: 'ILLUST',
  MANGA: 'MANGA',
  NOVEL: 'NOVEL',
};

// map values for ranking api option
export const RANKING_ILLUST = {
  day: 'day',
  week: 'week',
  month: 'month',
  dayMale: 'day_male',
  dayFemale: 'day_female',
  weekRookie: 'week_rookie',
  weekOriginal: 'week_original',
};

export const R18_RANKING_ILLUST = {
  dayR18: 'day_r18',
  dayMaleR18: 'day_male_r18',
  dayFemaleR18: 'day_female_r18',
  weekR18: 'week_r18',
};

export const R18G_RANKING_ILLUST = {
  weekR18G: 'week_r18g',
};

export const RANKING_MANGA = {
  day: 'day_manga',
  week: 'week_manga',
  month: 'month_manga',
  weekRookie: 'week_rookie_manga',
};

export const R18_RANKING_MANGA = {
  dayR18: 'day_r18_manga',
  weekR18: 'week_r18_manga',
};

export const R18G_RANKING_MANGA = {
  weekR18G: 'week_r18g_manga',
};

export const RANKING_NOVEL = {
  day: 'day',
  week: 'week',
  dayMale: 'day_male',
  dayFemale: 'day_female',
  weekRookie: 'week_rookie',
};

export const R18_RANKING_NOVEL = {
  dayR18: 'day_r18',
  dayMaleR18: 'day_male_r18',
  dayFemaleR18: 'day_female_r18',
  weekR18: 'week_r18',
};

export const R18G_RANKING_NOVEL = {
  weekR18G: 'week_r18g',
};

export const RANKING_FOR_UI = {
  // Illust
  DAILY_ILLUST: 'DAILY_ILLUST',
  DAILY_MALE_ILLUST: 'DAILY_MALE_ILLUST',
  DAILY_FEMALE_ILLUST: 'DAILY_FEMALE_ILLUST',
  WEEKLY_ORIGINAL_ILLUST: 'WEEKLY_ORIGINAL_ILLUST',
  WEEKLY_ROOKIE_ILLUST: 'WEEKLY_ROOKIE_ILLUST',
  WEEKLY_ILLUST: 'WEEKLY_ILLUST',
  MONTHLY_ILLUST: 'MONTHLY_ILLUST',
  PAST_ILLUST: 'PAST_ILLUST',

  // Manga
  DAILY_MANGA: 'DAILY_MANGA',
  WEEKLY_MANGA: 'WEEKLY_MANGA',
  MONTHLY_MANGA: 'MONTHLY_MANGA',
  WEEKLY_ROOKIE_MANGA: 'WEEKLY_ROOKIE_MANGA',
  PAST_MANGA: 'PAST_MANGA',

  // NOVEL
  DAILY_NOVEL: 'DAILY_NOVEL',
  WEEKLY_NOVEL: 'WEEKLY_NOVEL',
  DAILY_MALE_NOVEL: 'DAILY_MALE_NOVEL',
  DAILY_FEMALE_NOVEL: 'DAILY_FEMALE_NOVEL',
  WEEKLY_ROOKIE_NOVEL: 'WEEKLY_ROOKIE_NOVEL',
  PAST_NOVEL: 'PAST_NOVEL',
};

export const SORT_TYPES = {
  ASC: 'ASC',
  DESC: 'DESC',
};

export const TAG_TYPES = {
  PUBLIC: 'PUBLIC',
  PRIVATE: 'PRIVATE',
};

export const SEARCH_TYPES = {
  ILLUST: 'ILLUST',
  USER: 'USER',
  NOVEL: 'NOVEL',
};

export const SEARCH_PERIOD_TYPES = {
  ALL: 'ALL',
  LAST_DAY: 'LAST_DAY',
  LAST_HALF_YEAR: 'LAST_HALF_YEAR',
  LAST_MONTH: 'LAST_MONTH',
  LAST_WEEK: 'LAST_WEEK',
  LAST_YEAR: 'LAST_YEAR',
  DATE: 'DATE',
  CUSTOM_DATE: 'CUSTOM_DATE',
};

export const SAVE_FILE_NAME_USER_FOLDER_FORMAT = {
  USER_ID: 'USER_ID',
  USER_NAME: 'USER_NAME',
  USER_ID_USER_NAME: 'USER_ID_USER_NAME',
};

export const SAVE_FILE_NAME_FORMAT = {
  WORK_ID: 'WORK_ID',
  WORK_TITLE: 'WORK_TITLE',
  WORK_ID_WORK_TITLE: 'WORK_ID_WORK_TITLE',
};

export const LIKE_BUTTON_ACTION_TYPES = {
  PUBLIC_LIKE: 'PUBLIC_LIKE',
  PRIVATE_LIKE: 'PRIVATE_LIKE',
  EDIT_LIKE: 'EDIT_LIKE',
};

export const READING_DIRECTION_TYPES = {
  LEFT_TO_RIGHT: 'LEFT_TO_RIGHT',
  RIGHT_TO_LEFT: 'RIGHT_TO_LEFT',
};

export const SCREENS = {
  Main: 'Main',
  Auth: 'Auth',
  Login: 'Login',
  SignUp: 'SignUp',
  SearchFilterModal: 'SearchFilterModal',
  SearchFilterPeriodDateModal: 'SearchFilterPeriodDateModal',
  AccountSettingsModal: 'AccountSettingsModal',
  ImagesViewer: 'ImagesViewer',
  NovelReader: 'NovelReader',
  AddIllustComment: 'AddIllustComment',
  AddNovelComment: 'AddNovelComment',
  ReplyIllustComment: 'ReplyIllustComment',
  ReplyNovelComment: 'ReplyNovelComment',
  RecommendedTab: 'RecommendedTab',
  RankingTab: 'RankingTab',
  TrendingTab: 'TrendingTab',
  NewWorksTab: 'NewWorksTab',
  MyPageTab: 'MyPageTab',
  Recommended: 'Recommended',
  RankingPreview: 'RankingPreview',
  Ranking: 'Ranking',
  NovelRanking: 'NovelRanking',
  Trending: 'Trending',
  NewWorks: 'NewWorks',
  Detail: 'Detail',
  NovelDetail: 'NovelDetail',
  UserDetail: 'UserDetail',
  IllustComments: 'IllustComments',
  NovelComments: 'NovelComments',
  NovelSeries: 'NovelSeries',
  RelatedIllusts: 'RelatedIllusts',
  UserIllusts: 'UserIllusts',
  UserMangas: 'UserMangas',
  UserNovels: 'UserNovels',
  UserBookmarkIllusts: 'UserBookmarkIllusts',
  UserBookmarkNovels: 'UserBookmarkNovels',
  UserFollowing: 'UserFollowing',
  UserMyPixiv: 'UserMyPixiv',
  SearchResult: 'SearchResult',
  RecommendedUsers: 'RecommendedUsers',
  MyConnection: 'MyConnection',
  MyCollection: 'MyCollection',
  MyWorks: 'MyWorks',
  BrowsingHistory: 'BrowsingHistory',
  Settings: 'Settings',
  AccountSettings: 'AccountSettings',
  AdvanceAccountSettings: 'AdvanceAccountSettings',
  ReadingSettings: 'ReadingSettings',
  SaveImageSettings: 'SaveImageSettings',
  InitialScreenSettings: 'InitialScreenSettings',
  LikeButtonSettings: 'LikeButtonSettings',
  TrendingSearchSettings: 'TrendingSearchSettings',
  HighlightTagsSettings: 'HighlightTagsSettings',
  MuteSettings: 'MuteSettings',
  MuteTagsSettings: 'MuteTagsSettings',
  MuteUsersSettings: 'MuteUsersSettings',
  Backup: 'Backup',
  Encyclopedia: 'Encyclopedia',
  Language: 'Language',
  Theme: 'Theme',
  Feedback: 'Feedback',
  PrivacyPolicy: 'PrivacyPolicy',
  About: 'About',
};
