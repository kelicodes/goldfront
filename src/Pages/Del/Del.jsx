import { TbTruckDelivery } from "react-icons/tb";
import { RiCustomerServiceFill, RiSecurePaymentFill } from "react-icons/ri";
import { GiReturnArrow } from "react-icons/gi";

import "./Del.css";

const Del = () => {
  return (
    <div className="del-section">
      <h2 className="del-title">Fast, Secure & Hassle-free.</h2>
      <div className="del">
        <div className="delitem"> 
          <TbTruckDelivery className="del-icon"/>
          <p>Delivery within 48 hours</p>
        </div>
        <div className="delitem"> 
          <RiCustomerServiceFill className="del-icon"/>
          <p>24 hours Customer support</p>
        </div>
        <div className="delitem"> 
          <GiReturnArrow className="del-icon"/>
          <p>Easy returns</p>
        </div>
        <div className="delitem">
          <RiSecurePaymentFill className="del-icon"/>
          <p>Secure Payments</p>
        </div>
      </div>
    </div>
  );
}

export default Del;
