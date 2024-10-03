import { ANSI } from "./ansi.mjs";

const ART = `
 ______  ____     ___      ______   ____       __      ______   ___      ___
|      ||    |   /  _]    |      | /    |     /  ]    |      | /   \\   /  _]
|      | |  |   /  /      |      ||  o  |    /  /     |      ||     |  /  [_
|_|  |_| |  |  /  /       |_|  |_||     |   /  /      |_|  |_||  O  | |    _]
  |  |   |  | |   \\        |  |  |  _     /   \\_       |  |  |     | |   [_
  |  |   |  |  \\   \\_     |  |  |  \\     |      |     |     ||    |
  |__|  |____|  \\_____]          |__|  |__|__|\\____|   |__|   \\___/ |_____|

`


const ART2 = `
${ANSI.COLOR.GREEN} ______  ____     ___    ${ANSI.COLOR.BLUE}______    _____        __       ${ANSI.COLOR.RED}______    ___     _____
${ANSI.COLOR.GREEN}|      ||    |   /  _]  ${ANSI.COLOR.BLUE}|      |  /     \\      /  ]     ${ANSI.COLOR.RED}|      | /    \\   |    _|    
${ANSI.COLOR.GREEN}|      | |  |   /  /    ${ANSI.COLOR.BLUE}|      | |   o   |    /  /      ${ANSI.COLOR.RED}|      ||     |   |   |
${ANSI.COLOR.GREEN}|_|  |_| |  |  /  /     ${ANSI.COLOR.BLUE}|_|  |_| |   _   |   |  /       ${ANSI.COLOR.RED}|_|  |_||  O  |   |   |__   
${ANSI.COLOR.GREEN}  |  |   |  | |  \\        ${ANSI.COLOR.BLUE}|  |   |  | |  |   |  \\         ${ANSI.COLOR.RED}|  |  |     |   |   ___|    
${ANSI.COLOR.GREEN}  |  |   |  |  \\  \\__     ${ANSI.COLOR.BLUE}|  |   |  | |  |   \\   \\__      ${ANSI.COLOR.RED}|  |  |     |   |   |__
${ANSI.COLOR.GREEN}  |__|  |____|  \\_____]   ${ANSI.COLOR.BLUE}|__|   |__| |__|    \\______|    ${ANSI.COLOR.RED}|__|   \\___/    |______|
${ANSI.RESET}
  `
 
  
function showSplashScreen() {
    console.log(ART2);
}

export default showSplashScreen;
