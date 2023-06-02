import { ethers } from "ethers";
import tornadoJSON from "../json/Tornado.json";

export const tornadoAddress = "0x5D86B054af1072219b3Be1852E40dd07436eeFC7"
export const tornadoInterface = new ethers.utils.Interface(tornadoJSON);