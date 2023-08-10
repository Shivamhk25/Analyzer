import React, { useState, useEffect } from "react";
import {
  ChakraProvider,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Tooltip,
} from "@chakra-ui/react";
import { Box } from "@chakra-ui/layout";

const MyNewSlider = ({ sliderHandler, credits }) => {
  // console.log(credits);
  const [sliderValue, setSliderValue] = useState(500);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipName, setTooltipName] = useState("500");

  useEffect(() => {
    if (credits === 500) {
      setSliderValue(500);
      setTooltipName("500");
    } else if (credits === 10000) {
      setSliderValue(10000);
      setTooltipName("25k");
    } else if (credits === 25000) {
      setSliderValue(25000);
      setTooltipName("200k");
    } else if (credits === 75000) {
      setSliderValue(75000);
      setTooltipName("500k");
    }
  }, [credits]);
  const controlHandeler1 = (value) => {
    setSliderValue(value);
  };
  const controlHandeler = (value) => {
    // console.log("%%final value",value);
    if (value <= 4500) {
      setSliderValue(500);
      sliderHandler(500);
      setTooltipName("500");
    } else if (value > 4500 && value <= 17000) {
      setSliderValue(10000);
      sliderHandler(10000);
      setTooltipName("25k");
    } else if (value > 17000 && value <= 45000) {
      setSliderValue(25000);
      sliderHandler(25000);
      setTooltipName("200k");
    } else if (value > 45000 && value <= 75000) {
      setSliderValue(75000);
      sliderHandler(75000);
      setTooltipName("500k");
    } else {
      console.log("invalid slider");
    }
  };

  return (
    <>
      <ChakraProvider>
        <div
          style={{
            paddingLeft: "36px",
            paddingRight: "36px",
            paddingTop: "10px",
          }}
        >
          <Slider
            id="slider"
            min={0}
            max={75000}
            value={sliderValue}
            colorScheme={"red"}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onChange={(value) => controlHandeler1(value)}
            onChangeEnd={(value) => controlHandeler(value)}
          >
            <SliderMark
              value={500}
              textAlign="center"
              color="#555"
              mt="6"
              ml="-5"
              fontSize={12}
            >
              500
            </SliderMark>
            <SliderMark
              value={10000}
              textAlign="center"
              color="#555"
              mt="6"
              ml="-3"
              fontSize={12}
            >
              25k
            </SliderMark>
            <SliderMark
              value={25000}
              textAlign="center"
              color="#555"
              mt="6"
              ml="-4"
              fontSize={12}
            >
              200k
            </SliderMark>
            <SliderMark
              value={75000}
              textAlign="center"
              color="#555"
              mt="6"
              ml="-4"
              fontSize={12}
            >
              500k
            </SliderMark>
            <SliderTrack h="6px">
              <SliderFilledTrack bg="tomato" />
            </SliderTrack>
            <Tooltip
              hasArrow
              bg="tomato"
              color="white"
              placement="top"
              isOpen={showTooltip}
              label={tooltipName}
              fontSize={17}
              borderRadius={6}
            >
              <SliderThumb boxSize={6}>
                <Box color="tomato" as={SliderIcon} />
              </SliderThumb>
            </Tooltip>
          </Slider>
        </div>
      </ChakraProvider>
    </>
  );
};

export default MyNewSlider;

export const SliderIcon = () => {
  return (
    <div>
      {/* <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        width="30"
        height="30"
        viewBox="0 0 30 30"
      >
        <defs></defs>
        <path
          className="cls-1"
          d="M14.891,0a15,15,0,1,1-15,15A15,15,0,0,1,14.891,0Z"
          style={{ fill: "#ff5050", fillRule: "evenodd" }}
        />
        <image
          id="wishlist"
          x="6"
          y="7"
          width="18"
          height="17"
          xlinkHref="data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAARCAYAAADQWvz5AAABkklEQVQ4jaWUQUuVURCGHy8XQZBCJKk2QlA7WwlS0qIWgmCQCK1KaFMhkitXQavAhRAtCuoH9AdUECSKgrQWma5sEYQLFQxEqVyo9MTIXJBL33cDB4Yzc8477zffzJzTpJLyCLgCnAF+A6vAeK4hZ4EnQCdwAtgA5jMOgkidUj+pN9ULao/6VP2lnlbb1J/qM/VyYobUD+rcYTLqQ3U1Cev1rjqfOlaA+aY+DuOzeq0AFLqmbpecX1IXq8AW8IZiiTo0l5wvAOtBtF8CCpkAKg0we0HUAnQAmwWgxQYkJ4HWSn7tegNwmQxEMkEyAwwfg+g28DoGspJDdwt49x+B/cAoUM0mhPbWWjisbpa0uKb31F31fg7lpPpDvXgUNK2+LSE5pa6rXemfyzVIl+rB39VXBUQR8DLtF+q+eif9mfr5OA9cBWb/UZtdYCft9qxRW/p7Rb/xRf2qdh7Z61YP1Gr6tWt1Q10pK+xzdUN9oI6oC1nHZbUvuq2Oqn/UwUZdiucksltSe3MvXoGPuf/+kFT5CxB8Mon8QW+6AAAAAElFTkSuQmCC"
        />
      </svg> */}

      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        width="30"
        height="30"
        viewBox="0 0 30 30"
      >
        <image
          id="Slider"
          width="30"
          height="30"
          xlinkHref="data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAADr0lEQVRIiZWX/WtPcRTHX/Od5WFsM7MkfsCYiKw0Rloe5hdJFLZWFClL+A/IXyCNFclvm634RcRWnvKQsCg/mHkYkdqDyVPZzPTe+dx9v/t+79Pedbv3fs75nPe5555z7rlZw9u3EwMTgS3AZmAVMB/Id9u+Ae+AJ0AbcBMYjDIZRSzjx4A6oCiOh0AvcAY45ZzyxYQQA3uAV8DxcZAKM92eV85GbOIEcBZoAorHQZiOYmfjrLM5Btk+pC3ADl9TiQQsWwYLFsC0afDjB7x9Cy9fwtBQkAOHnBO7gFGlxInS0lSl08Be3+0bNsDWrdDXB0+f2vHlC8yZA9u2QW4uvH8fRL4EKASuewupybUbuJSxJSsL9u2D16/hwYMgw1BRAXqIixdheDhIS++8OZVY2dsBzMpQ3bnTwvn8eXKtsBCKiqCnxyLgYcUKWLgQLl8OIu4GFivbveQ65ksq4wqhR6r3WlcHGzca+aZNdj99uslfvDD9osAimOW4RrI6x9VpJvRer12zZYX8wAFoaoJ//2DpUkuoxkbYv9/kwtWr5lgwxJUj4qrAOs3Lg95eu1Y2t7fD4CBMngznzsGkSeaEEm35ctP7+jUZAX+Iq8oj9oeMepg3Dzo64PdvmD0bVq+288+flnhz5yZ1U/f5Y4vquCxQnEipe9XsjBmWPN+/Q06OrSmbFRVde5gQ1hBHUCbiRYHigQGYOhV+/bJwHjwIf/9Cfb3J792Dw4chOxvOn7e1KVPgz58o4hK5lhcovn8f1q2za4X4zh1zpNh1Up1FdPeuOSesXRte74a89JY5Fp2d1pVaW60pqKw+foTKSigogP5+uHAhWcvKbGV7W1sU8UgD6Q79+ugJFN7HjyONUV5uefHwYZRmj0LdGaoiI0qgRMYHZiwkX7MGHj2KdhA6RfwsVEUhvnULqoKrbgTqYrdvh/XpVLSLuDVSTa1Qn8L8fH+5GkZJienFQ6tH3Bep3twM1dX+spoak8dDj+YyEQ8A9ZFb9CXq6oKytH6zciV8+GDyeNBEMuC1mFPukxWOGzdg/Xrr1YJ6te61Hv9pxTU6c2kaPBK5TYmjkNbW2r3OLS1xEwrH8Y20Ya/ZjaXh0Ljz6ZO1z8+f7T4ezqROOOnd/ChwJdKMQvvmzXhCfMXZHkU68ZCbBhtCzXi1HS/EDekTJgFz9ZCbEqpjJVwwup2NunTSIGIPeh8azE7GqvMkpKs92ps5tTqM96dNfdP7aStwsv6UnzY1Ix3qDcEA/gOT8BrfsOLRwQAAAABJRU5ErkJggg=="
        />
      </svg>
    </div>
  );
};
