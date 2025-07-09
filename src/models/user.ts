import {Schema,model} from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser {
    username: string;
    email: string;
    password: string;
    role: 'admin' | 'user';
    firstName?: string;
    lastName?: string;
    socialLinks?: {
      website?: string;
      facebook?: string;
      instagram?: string;
      linkedin?:string;
      x?:string;
      youtube?:string;
    }
  }

  const userSchema = new Schema<IUser>(
    {
      username: {
        type: String,
        required: [true, 'Username is required'],
        maxLength: [20, 'Username must be less than 20 characters'],
        unique: true,
      },
      email: {
        type: String,
        required: [true, 'Email is required'],
        maxLength: [50, 'Email must be less than 50 characters'],
        unique: true,
      },
      password: {
        type: String,
        required: [true, 'Password is required'],
        select: false, // Sorgularda şifrenin gelmesini engeller
      },
      role: {
        type: String,
        required: [true, 'Role is required'],
        enum: {
          values: ['admin', 'user'],
          message: '{VALUE} is not supported',
        },
        default: 'user', // Varsayılan değer
      },
      firstName: {
        type: String,
        maxLength: [20, 'First name must be less than 20 characters'],
      },
      lastName: {
        type: String,
        maxLength: [20, 'Last name must be less than 20 characters'],
      },
      socialLinks: { // Bu kısım görsellerden çıkarım yapılarak eklendi
          facebook: {
              type: String,
              maxLength: [100, 'Facebook profile url must be less than 100 characters'],
          },
          instagram: {
            type: String,
            maxLength: [100, 'Instagram profile url must be less than 100 characters'],
          },
          x: {
            type: String,
            maxLength: [100, 'X profile url must be less than 100 characters'],
          },
          youtube: {
            type: String,
            maxLength: [100, 'Youtube profile url must be less than 100 characters'],
          },
          website: {
            type: String,
            maxLength: [100, 'Website url must be less than 100 characters'],
          },
          linkedin: {
            type: String,
            maxLength: [100, 'Linkedin profile url must be less than 100 characters'],
          },    
      },
    },
    {
      timestamps: true, // createdAt ve updatedAt alanlarını otomatik ekler
    }
  );

  userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
      next();
      return;
    }
    this.password=await bcrypt.hash(this.password,10);
    next();
  })
  
  export default model<IUser>('User', userSchema);