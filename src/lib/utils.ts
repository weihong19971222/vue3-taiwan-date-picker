import moment from "moment";

const SEVENDAYS = 7; // 建立一個通用變數，存放一週有7天

// 處理每週的資訊
function processWeekDays(mmt, isFirstWeek=false){
    const totalDays = mmt.daysInMonth();
    
    // isFirstWeek=true, 取得第一週的第一天，在星期幾，快速建立一第一週的資訊
    // isFirstWeek=false, 直接從0，也就是Sunday開始
    const startDay = isFirstWeek?mmt.startOf("month").day():0;

    const weekDays:number[] = Array(SEVENDAYS).fill(0); // 先建立一週的Array，內容先放0
    let isFinished = false; //<-- 通知上一層函式的迴圈是否結束
    for(let d=startDay; d<SEVENDAYS; d++){
        weekDays[d] = mmt.date(); // 我們控制了startDay，若以2020.10.1是星期四來說，第一週的部分直接從 Array的idx=4開始放日期
        if(mmt.date()!==totalDays)
            mmt.add(1, "day"); 
        else{
            isFinished=true;
            break;
        }
    }
    return {weekDays, isFinished}; //<-- 回傳weekDays & isFinished
}

// 取得當月每週的資訊
export default function getWeeksInMonth(date:string){
    const mmt = moment(date);
    const weekDayList:number[][] = []; 

    // 由於每月的第一天不見得是在星期天，故我們需要先處理第一週的部分
    const {weekDays} = processWeekDays(mmt, true);
    weekDayList.push(weekDays);

    // 其他的部份可以靠Loop來依序回傳每週的日期
    let loopStatus = false;
    while(!loopStatus){
        let result = processWeekDays(mmt);
        const {weekDays} = result;
        weekDayList.push( weekDays );
        loopStatus = result["isFinished"];
    }

    return weekDayList; 
}

const WEEKDAYNAMELIST_ZH = ["日", "一", "二", "三", "四", "五", "六"];
const MONTHNAMELIST_ZH = ["", "一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];

export {
    WEEKDAYNAMELIST_ZH,
    MONTHNAMELIST_ZH
}