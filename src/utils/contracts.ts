import { ethers } from "ethers";
import tornadoJSON from "../json/Tornado.json";

export const tornadoAddress = "0x6f08E7CCAac17a7089634D6bB763c1d6FaAC9F79"
export const tornadoInterface = new ethers.utils.Interface(tornadoJSON);