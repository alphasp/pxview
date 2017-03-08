import { schema, arrayOf } from 'normalizr';

const illustSchema = new schema.Entity('illusts');
const userSchema = new schema.Entity('users');
const userPreviewSchema = new schema.Entity('userPreviews', {}, {
  // idAttribute: (value, parent, key) => value.user.id
});

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

const Schemas = {
  ILLUST: illustSchema,
  ILLUST_ARRAY: [illustSchema], //schema.Array(illustSchema)
  USER: userSchema,
  USER_ARRAY: [userSchema],
  USER_PREVIEW_ARRAY: [userPreviewSchema]
}

export default Schemas;