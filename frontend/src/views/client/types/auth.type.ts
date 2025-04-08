
import { SuccesRessponse } from './ultils.type'
import { User } from './user.type'


export type AuthRespon = SuccesRessponse<{
  token: string
  refresh_token: string
  user: User
}>