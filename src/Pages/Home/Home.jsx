import Banner from "../../Components/Banner/Banner.jsx"

import Categories from "../../Components/Categories/Categories.jsx"
import Collection from "../../Pages/Collection/Collection.jsx"
import Del from "../Del/Del.jsx"
import FAQ from "../../Components/Faq/Faq.jsx"
import Testimonials from "../../Components/Testimonial/Testimonial.jsx"


const Home=()=>{
    return (<div className="home">
        <Banner/>
        <Categories/>
        <Collection/>
        <Del/>
        <Testimonials/>
        <FAQ/>
    </div>)
}


export default Home