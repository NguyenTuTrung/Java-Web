import axios, { AxiosError, AxiosInstance } from 'axios'
import { toast } from 'react-toastify'
import { clearLs, getAccessTokenFromLs, setAccesTokenLs, setProfile } from './auth'
import { AuthRespon } from '../types/auth.type'
import HttpStatusCode from '../constants/httpStatusCode.enum'


class Http {
  instance: AxiosInstance
  private accesToken: string

  constructor() {
    this.accesToken = getAccessTokenFromLs()
    this.instance = axios.create({
      baseURL: 'http://localhost:8080/api/v1/',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    this.instance.interceptors.request.use(
      (config) => {
        if (this.accesToken) {
          config.headers.authorization = this.accesToken
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config
        const data = response.data as AuthRespon
        if (url === '/login' || url === '/register') {
          this.accesToken = data.data?.access_token
          setAccesTokenLs(this.accesToken)
          setProfile(data.data.user)
        } else if (url === '/logout') {
          this.accesToken = ''
          clearLs()
        }

        return response
      },
      (error: AxiosError) => {
        if (error.response?.status !== HttpStatusCode.UnprocessableEntity) {
          const data: any | undefined = error.response?.data
          const message = data?.message || error.message
          toast.error(message)
        }
        return Promise.reject(error)
      }
    )
  }
}

const http = new Http().instance

export default http