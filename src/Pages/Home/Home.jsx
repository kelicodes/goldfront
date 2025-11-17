import Banner from "../../Components/Banner/Banner.jsx"

import Categories from "../../Components/Categories/Categories.jsx"
import Collection from "../../Pages/Collection/Collection.jsx"


const Home=()=>{
    return (<div className="home">
        <Banner/>
        <Categories/>
        <Collection/>
    </div>)
}


export default Home