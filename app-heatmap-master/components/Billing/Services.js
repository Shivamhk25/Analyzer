import React, { useState, useEffect } from "react";
import { Heading } from "@chakra-ui/react";
import Bicycle from "../../images/bicycleFull.png";
import HatchBack from "../../images/hatchbackFull.png";
import Plane from "../../images/aeroplane.png";
import Sedan from "../../images/car.png";
import Helicopter from "../../images/helicopter.png";
import Formula from "../../images/formula.png";

const Services = ({ credits, monthlyPrice }) => {
  const [myIcon, setMyIcon] = useState("");
  const [finalPrice, setFinalPrice] = useState(0);
  const [finalPlan, setFinalPlan] = useState("Free Plan");

  const PlaneIcon = (icon) => {
    return (
      <div>
        <img src={icon} alt="plan icon" />
      </div>
    );
  };

  useEffect(() => {
    if (credits <= 500) {
      setFinalPrice(0);
      setFinalPlan("Free Plan");
      setMyIcon(PlaneIcon(Bicycle));
    } else if (credits > 500 && credits <= 10000) {
      setFinalPrice(11);
      setFinalPlan("Pro Plan");
      setMyIcon(PlaneIcon(HatchBack));
    } else if (credits > 10000 && credits <= 25000) {
      setFinalPrice(51);
      setFinalPlan("Vip Plan");
      setMyIcon(PlaneIcon(Sedan));
    } else if (credits > 25000 && credits <= 75000) {
      setFinalPrice(99);
      setFinalPlan("Royal Plan");
      setMyIcon(PlaneIcon(Formula));
    }
  }, [credits]);

  // console.log(monthlyPrice, "from monthlyPrice");
  return (
    <>
      <div
        style={{
          backgroundColor: "white",
          width: "40%",
          height: "180px",
          marginLeft: "30px",
        }}
      >
        {myIcon}

        <Heading
          ml={3}
          mt={4}
          color="#68696C"
          fontSize={16}
          fontWeight="800"
          as="h2"
          size="xl"
        >
          {finalPlan}
        </Heading>

        <Heading
          ml={2}
          mt={4}
          color="#878787"
          fontSize={24}
          fontWeight="800"
          as="h2"
          size="xl"
        >
          ${monthlyPrice}
        </Heading>
        <Heading
          ml={4}
          mt={1}
          color="#878787"
          fontSize={12}
          fontWeight="600"
          as="h2"
          size="xl"
        >
          Per month
        </Heading>
      </div>
    </>
  );
};

export default Services;
