import { Document } from 'mongoose';

export interface Hook extends Document {
  hookId: string;
  name?: string;
  url: string;
  event: string[];
  secret: string;
  rotate?: boolean;
}
