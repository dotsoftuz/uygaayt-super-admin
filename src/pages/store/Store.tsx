import { Grid } from '@mui/material'
import { StoreStyled } from './Store.styled'
import StoreBg from 'assets/images/storeBg.png'
import { RightArrowIcon } from 'assets/svgs'

const Store = () => {
   // @ts-ignore
   const stores = JSON.parse(localStorage.getItem('stores'))

   return (
      <StoreStyled>
         <Grid container>
            <Grid item sm={7.5}>
               <img src={StoreBg} alt="store" className="img" />
            </Grid>
            <Grid item sm={4.5} className='stores ps-4 pe-5'>
               <h2 className="title">Welcome back</h2>
               <span className="comment">Do'konlardan birini tanlang</span>
               {stores?.map((store: any) => (
                  <div
                     className='store'
                     key={store._id}
                     onClick={() => {
                        localStorage.setItem('storeId', store._id)
                        setTimeout(() => window.location.replace("/"), 0)
                     }}
                  >
                     <span>{store.name}</span>
                     <RightArrowIcon />
                  </div>
               ))}
            </Grid>
         </Grid>
      </StoreStyled>
   )
}

export default Store
