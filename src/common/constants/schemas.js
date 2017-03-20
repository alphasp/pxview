import { schema, arrayOf } from 'normalizr';

const illustSchema = new schema.Entity('illusts');
const userSchema = new schema.Entity('users');
const userPreviewSchema = new schema.Entity('userPreviews');
const userProfileSchema = new schema.Entity('userProfile');

illustSchema.define({
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
  USER: userSchema,
  USER_ARRAY: [userSchema],
  USER_PREVIEW_ARRAY: [userPreviewSchema],
  USER_PROFILE: userProfileSchema
}

export default Schemas;