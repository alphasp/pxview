import { schema } from 'normalizr';

const illustSchema = new schema.Entity('illusts');
const illustCommentSchema = new schema.Entity('illustComments');
const illustTagSchema = new schema.Entity(
  'illustTags',
  {},
  {
    idAttribute: 'tag',
  },
);
const novelSchema = new schema.Entity('novels');
const novelCommentSchema = new schema.Entity('novelComments');
const userSchema = new schema.Entity('users');
const userPreviewSchema = new schema.Entity('userPreviews');
const userProfileSchema = new schema.Entity('userProfiles');

illustSchema.define({
  user: userSchema,
});

illustCommentSchema.define({
  user: userSchema,
});

illustTagSchema.define({
  illust: illustSchema,
});

novelSchema.define({
  user: userSchema,
});

novelCommentSchema.define({
  user: userSchema,
});

userSchema.define({
  illusts: [illustSchema],
});

userPreviewSchema.define({
  user: userSchema,
  illusts: [illustSchema],
});

// userProfileSchema.define({
//   user: userSchema,
// });

const Schemas = {
  ILLUST: illustSchema,
  ILLUST_ARRAY: [illustSchema],
  ILLUST_COMMENT_ARRAY: [illustCommentSchema],
  ILLUST_TAG_ARRAY: [illustTagSchema],
  NOVEL: novelSchema,
  NOVEL_ARRAY: [novelSchema],
  NOVEL_COMMENT_ARRAY: [novelCommentSchema],
  USER: userSchema,
  USER_ARRAY: [userSchema],
  USER_PREVIEW_ARRAY: [userPreviewSchema],
  USER_PROFILE: userProfileSchema,
};

export default Schemas;
