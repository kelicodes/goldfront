import Banner from "../../Components/Banner/Banner.jsx"

import Categories from "../../Components/Categories/Categories.jsx"
import Collection from "../../Pages/Collection/Collection.jsx"
import Del from "../Del/Del.jsx"


const Home=()=>{
    return (<div className="home">
        <Banner/>
        <Categories/>
        <Collection/>
        <Del/>
    </div>)
}


export default Home