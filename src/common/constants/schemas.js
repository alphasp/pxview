import { schema, arrayOf } from 'normalizr';

const illustSchema = new schema.Entity('illusts');
const illustCommentSchema = new schema.Entity('illustComments');
const userSchema = new schema.Entity('users');
const userPreviewSchema = new schema.Entity('userPreviews');
const userProfileSchema = new schema.Entity('userProfiles');

illustSchema.define({
  user: userSchema,
});

illustCommentSchema.define({
  user: userSchema,
});

userSchema.define({
  illusts: [illustSchema],
});

userPreviewSchema.define({
  user: userSchema,
  illusts: [illustSchema]
});

userProfileSchema.define({
  user: userSchema
})

const Schemas = {
  ILLUST: illustSchema,
  ILLUST_ARRAY: [illustSchema], //schema.Array(illustSchema)
  ILLUST_COMMENT_ARRAY: [illustCommentSchema],
  USER: userSchema,
  USER_ARRAY: [userSchema],
  USER_PREVIEW_ARRAY: [userPreviewSchema],
  USER_PROFILE: userProfileSchema
}

export default Schemas;