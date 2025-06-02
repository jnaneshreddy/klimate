import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/theme-provider';
import {Link} from 'react-router-dom';
import { CitySearch } from './city-search';

const Header = () => {
    const {theme,setTheme} = useTheme()
    const isDark = theme === 'dark'
  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur py-2  supports-[backdrop-filter]:bg-background/60'>
       <div className='container mx-auto flex h-16 items-center justify-between px-4'>
        <Link to="/">
        <img src ={theme ==='dark' ? '/logo.png':'logo2.png'} alt="climate logo" className='h-14'/>
        </Link>
        <div className='flex items-center gap-2 sm:gap-4 w-auto'>

            {/* Search  */}
            <div className="max-w-[140px] sm:max-w-xs flex-shrink">
           <CitySearch />
           </div>
            <div onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className={`flex items-center cursor-pointer ml-2 sm:ml-4 transition-transform duration-500
            ${isDark ? 'rotate-180' : 'rotate-0' }
            `} >
            {isDark ?(<Sun className='h-6 w-6 text-yellow-500 rotate-0 transition-all' />
        ):(
            <Moon className='h-6 w-6 text-blue-500 rotate-0 transition-all' />
        )}
            </div>
        </div>
    </div>
    </header>
  )
}

export default Header