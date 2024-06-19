import Auth from '../components/Auth'
import Quote from '../components/Quote'

function signIn() {
  return (
    <div className='grid grid-cols-2 h-screen'>
        <div >
            <Auth type='signUp' />
        </div>
        <div className='invisible lg:visible'>
            <Quote />
        </div>
    </div>
  )
}

export default signIn