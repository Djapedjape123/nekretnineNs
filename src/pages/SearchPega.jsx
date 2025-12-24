import SearchForm from '../components/SearchForm'
import { t } from '../i1n8'
import ScrollFloat from './ScrollFloat'

export default function SearchPage() {
  return (
    <div className="w-full min-h-screen py-24 bg-gradient-to-b from-black to-yellow-900 flex flex-col text-white">
     

      <ScrollFloat
        animationDuration={18}
        ease='back.inOut(2)'
        scrollStart='center bottom+=50%'
        scrollEnd='bottom bottom-=40%'
        stagger={0.03}
        
      >
       {t('naslov', 'Pretrazite svoju nekretninu')}
      </ScrollFloat>
      
      {/*  forma */}
      <div className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-4xl">
          <SearchForm onSearch={(params) => console.log('Pretraga:', params)} />
        </div>
      </div>
    </div>
  )
}
