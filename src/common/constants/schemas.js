import { schema, arrayOf } from 'normalizr';

const illustSchema = new schema.Entity('illusts');
const userSchema = new schema.Entity('users');

illustSchema.define({
  user: userSchema,
});

userSchema.define({
  illusts: [illustSchema],
});

const Schemas = {
  ILLUST: illustSchema,
  ILLUST_ARRAY: [illustSchema], //schema.Array(illustSchema)
  USER: userSchema,
  USER_ARRAY: [userSchema],
}

export default Schemas;