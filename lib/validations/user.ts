import { z } from 'zod';

const userValidation = z.object({
  profile_photo: z.string().url(),
  username: z.string().min(3).max(30),
  name: z.string().min(3).max(30),
  bio: z.string().min(3).max(999),
})

export default userValidation;
