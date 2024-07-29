<script setup lang="ts">
    import {ref,computed,onMounted} from "vue";

    interface DateResultItem {
        day: number;
        value: string;
        show: boolean;
    }

    interface YearResultItem {
        value: string;
        label: number;
    }
    
    // 取得當月每週的資訊
    function getWeeksInMonth(date:string){
        
        const weekDayList:DateResultItem[][] = []; 
        
        const dateObj = new Date(date)
        // 本月總天數
        const totalDays = new Date(dateObj.getFullYear(), dateObj.getMonth() + 1, 0).getDate();
        // 本月第一天是星期幾
        const startDay = new Date(dateObj.getFullYear(), dateObj.getMonth() , 1).getDay();

        const nowYM = `${dateObj.getFullYear()}-${(dateObj.getMonth()+1).toString().padStart(2, '0')}-`
        
        let i = startDay
        let isFinished = false
        let actionvalue = 1
        let weeks = []

        if(startDay !== 0){
            const preMonth = dateObj.getMonth()
            let preYM = `${dateObj.getFullYear()}-${(dateObj.getMonth()).toString().padStart(2, '0')}-`
            let preLastDay = new Date(dateObj.getFullYear(), dateObj.getMonth(), 0).getDate()
            if(preMonth <= 0){
                preYM = `${dateObj.getFullYear()-1}-12-`
                preLastDay = new Date(dateObj.getFullYear()-1, 11, 0).getDate()
            }

            for( let p = startDay; p > 0; p--){
                weeks.push({
                    day:preLastDay-p+1,
                    value:`${preYM}${(preLastDay-p+1).toString().padStart(2, '0')}`,
                    show:false
                })
            }
  
        }
            
        while( !isFinished ){
            i++
            weeks.push({
                day:actionvalue,
                value:`${nowYM}${actionvalue.toString().padStart(2, '0')}`,
                show:true
            })
            if(i === 7){
                i = 0
                weekDayList.push(weeks)
                weeks = []
            }
            if(actionvalue === totalDays) {
                const nextMonth = dateObj.getMonth()+2
                let nextYM = `${dateObj.getFullYear()}-${nextMonth.toString().padStart(2, '0')}-`
                if( nextMonth > 12){
                    nextYM = `${dateObj.getFullYear()+1}-01-`
                }     
                if(i !== 0){
                    for( let k = 0; k < (7-i); k++ ){
                        weeks.push({
                            day:k+1,
                            value:`${nextYM}${(k+1).toString().padStart(2, '0')}`,
                            show:false
                        })
                    }
                    weekDayList.push(weeks)
                }
                isFinished = true
            }
            actionvalue ++
        }            
            
        return weekDayList; 
    }

    const WEEKDAYNAMELIST_ZH = ["日", "一", "二", "三", "四", "五", "六"];
    const MONTHNAMELIST_ZH = ["", "一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];

    const props = defineProps({
        maxDate: { type: String, default: ''},
        minDate: { type: String, default: ''},
        clearButton: { type: Boolean, default: true},
        placeholder: { type: String, default: '請選擇日期'},
        modelValue:{type: String,default:""},

    })

    const day = ref('')
    if(props.modelValue === ''){
        const todayObj = new Date()  
        day.value = `${todayObj.getFullYear()}-${(todayObj.getMonth()+1).toString().padStart(2, '0')}-01` 
    }else{
        const modelValueObj = new Date(props.modelValue)  
        day.value = `${modelValueObj.getFullYear()}-${(modelValueObj.getMonth()+1).toString().padStart(2, '0')}-01` 
    }
    
    const placeholderText = ref(props.placeholder);

    const iptVal = computed(()=>{
        if(props.modelValue !== ''){
            const dateObj = new Date(props.modelValue)  
            return `${dateObj.getFullYear()-1911}-${(dateObj.getMonth()+1).toString().padStart(2, '0')}-${dateObj.getDate().toString().padStart(2, '0')}`;
        }
        return ''
    })

    const picker_show = ref(0)
    
    const root = ref(null)

    onMounted(() => {   
        document.addEventListener('click', (e) => {
            if ((root.value !== null) && !(root.value as HTMLElement).contains((e.target as HTMLElement))){
                picker_show.value = 0
            } 
        })  
    });

    const daysResult = computed(() => {
        if(day.value){
            return getWeeksInMonth(day.value);
        }
        return []
    })

    const year = computed(() => {
        if( day.value ){
            return `${new Date(day.value).getFullYear()-1911}`;
        }
        return ''
    })

    const month = computed(() => {
        if( day.value ){
            return MONTHNAMELIST_ZH[new Date(day.value).getMonth()+1];
        }
        return ''
    })

    // !!!
    const changMonth = (i:number) => {
        const dayObj = new Date(day.value)
        switch(picker_show.value){
            case 1:
                dayObj.setMonth(dayObj.getMonth() + i)
                day.value = `${dayObj.getFullYear()}-${(dayObj.getMonth()+1).toString().padStart(2, '0')}-01` 
                break
            case 2:
                day.value = `${dayObj.getFullYear()+i}-${(dayObj.getMonth()+1).toString().padStart(2, '0')}-01` 
                break
            case 3:
                day.value = `${dayObj.getFullYear()+(i*10)}-${(dayObj.getMonth()+1).toString().padStart(2, '0')}-01` 
                break
        }
        
    }

    const changYear = (i:number) => {
        const dayObj = new Date(day.value)
        let dateItem = `${dayObj.getFullYear()+i}-${(dayObj.getMonth()+1).toString().padStart(2, '0')}-01` 
        day.value = dateItem
    }

    const emit = defineEmits(['update:modelValue'])

    const selectDay = (date:string)=>{
        if( date ){    
            if(checkMinMax(date)){
                emit('update:modelValue', date)
                picker_show.value = 0
            }           
        }
    }

    const checkMinMax = (date:string) => {
        const dateObj = new Date(date);
        if( props.maxDate !== '' && dateObj.getTime() > new Date(props.maxDate).getTime() ){
            return false;
        }
        if( props.minDate !== '' && dateObj.getTime() < new Date(props.minDate).getTime() ){
            return false;
        }  
        return true;     
    }

    const months = [
        [{'label':'一月','value':'01'},{'label':'二月','value':'02'},{'label':'三月','value':'03'},{'label':'四月','value':'04'}],
        [{'label':'五月','value':'05'},{'label':'六月','value':'06'},{'label':'七月','value':'07'},{'label':'八月','value':'08'}],
        [{'label':'九月','value':'09'},{'label':'十月','value':'10'},{'label':'十一月','value':'11'},{'label':'十二月','value':'12'}]
    ]

    const monthActive = (mm:string) => {
        if( props.modelValue ){
            const dayObj = new Date(day.value)
            return (dayObj.getFullYear() === new Date(props.modelValue).getFullYear()) && (dayObj.getMonth()+1).toString().padStart(2, '0') === mm
        }
        return false
    }

    const selectMonth = (mm:string) => {  
        const dayObj = new Date(day.value)
        day.value = `${dayObj.getFullYear()}-${mm}-01` 
        picker_show.value = 1
    }

    const years = computed(() => {
        const dayYear = Math.floor((new Date(day.value).getFullYear()/10))
        let items:YearResultItem[] = []        
        for(let i = 0; i < 10; i++){
            const v = `${dayYear}${i}`
            items.push({
                value:v,
                label:parseInt(v)-1911,
            })
        }
        return items
    })

    const yearActive = (yyyy:string) => {
        if( props.modelValue ){
            return yyyy === new Date(props.modelValue).getFullYear().toString()
        }
        return false
    }


    const selecYear = (yyyy:string) => {
        const dayObj = new Date(day.value)
        day.value = `${yyyy}-${(dayObj.getMonth()+1).toString().padStart(2, '0')}-01` 
        picker_show.value = 2
    }

</script>

<template>
    <div ref="root" style="position: relative;">

        <div class="date-picker-ipt">
            <div class="date-icon">
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 7H8C6.89543 7 6 7.89543 6 9V23C6 24.1046 6.89543 25 8 25H22C23.1046 25 24 24.1046 24 23V9C24 7.89543 23.1046 7 22 7Z" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M19 5V9" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M11 5V9" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M6 10H24" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <rect x="6.1626" y="7.18237" width="17" height="3" fill="#333333"/>
                    <path d="M15.8618 13.6335V22.1824H14.1743V15.5789L12.147 16.2234V14.8933L15.6802 13.6335H15.8618Z" fill="#333333"/>
                </svg>
            </div>
            <input 
                type="text" 
                :placeholder="placeholderText" 
                :value="iptVal" 
                @click="()=>{ picker_show = (picker_show === 0)?1:0 }"
                @mousedown="(e)=>{e.preventDefault()}">
            <div v-show="props.clearButton" class="cross-btn" @click="()=>{emit('update:modelValue', '')}">&times;</div>
        </div>
        
        <div class="date-picker" v-show="picker_show !== 0">
            <div class="date-pick-header">
                <div>
                    <span v-show="picker_show === 1" class="span-btn" @click="changYear(-1)" style="margin-right: 5px;">&laquo;</span>
                    <span class="span-btn" @click="changMonth(-1)">&lt;</span>
                </div>
                <div>
                    <div v-show="picker_show == 3">{{ years[0]['label'] }}年 - {{ years[years.length-1]['label'] }}年</div>
                    <span v-show="picker_show !== 3" @click="()=>{ picker_show = 3 }">{{ year }} 年 </span>
                    <span v-show="picker_show === 1" @click="()=>{ picker_show = 2 }">{{ month }}</span>
                </div>
                <div>
                    <span class="span-btn" @click="changMonth(1)">&gt;</span>
                    <span v-show="picker_show === 1" class="span-btn" @click="changYear(1)" style="margin-left: 5px;">&raquo;</span>
                </div>
            </div>
            
            <table v-show="picker_show === 1">
                <thead>
                    <tr>
                        <th v-for="dayname in WEEKDAYNAMELIST_ZH">{{ dayname }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="result in daysResult">
                        <td v-for="item in result" @click="selectDay(item['value'])" :class="{active:item['value'] == props.modelValue,noshow:!item['show']}" >
                            {{ item['day'] }}
                        </td>
                    </tr>
                </tbody>
            </table>

            <div v-show="picker_show === 2">
                <div style="display: flex;" v-for="month in months">
                    <div 
                        v-for="mm in month" 
                        @click="selectMonth(mm['value'])" 
                        :class="{'month-content':true,'active':monthActive(mm['value'])}">{{ mm['label'] }}</div>
                </div>
            </div>

            <div v-show="picker_show === 3">
                <div style="display: flex;flex-wrap: wrap;">
                    <div 
                        v-for="year in years" 
                        @click="selecYear(year['value'])" 
                        :class="{'year-content':true,'active':yearActive(year['value'])}">{{ year['label'] }} 年</div>
                </div>
            </div>
        </div>

    </div>
</template>

<style scoped>
    .span-btn{
        padding: 5px;
        font-size: 18px;
        font-weight: 900;
    }
    .date-picker-ipt{
        position: relative;
        width: 160px;
        height: 40px;
    }
    .date-picker-ipt .cross-btn{
        position: absolute;
        top: 50%;
        right: -55px;
        font-size: 20px;
        transform: translate(0,-50%);
        cursor: pointer;
        font-weight: 900;
    }
    .date-picker-ipt .date-icon{
        position: absolute;
        top: 58%;
        left: 5px;
        transform: translate(0,-50%);
    }
    input{
        width: 100%;
        height: 100%;
        border: 1px solid #dcdfe6;
        padding-left: 35px;
        padding-right: 30px;
        border-radius: 5px;
        font-size: 16px;
        cursor: pointer;
    }
    input:focus{
        outline: none;
    }
    .date-picker{
        position: absolute;
        padding: 15px;
        box-shadow:0 2px 12px 0 rgba(0,0,0,.1);
        z-index:7777;
        background-color: #fff;
        border-radius: 5px;
        top: 48px;
        min-width: 290px;
        display: flex;
        flex-direction: column;
    }
    .date-pick-header{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 0;
    }
    .date-pick-header span{
        cursor: pointer;
    }
    .date-pick-header span:hover{
        color: #409eff;
    }

    table th, table td{
        padding: 5px 8px;
    }
    table th{
        border-bottom: 8px solid #325c9b;
    }
    table td{
        cursor: pointer;
    }
    table td:hover{
        color: #409eff;
    }
    table td.active{
        background-color: #409eff;
        color: #fff;
        border-radius: 50%;
    }
    table td.noshow{
        color: #c0c4cc;
    }
    .month-content{
        flex:1;
        text-align: center;
        padding: 16px 5px;
        cursor: pointer;
        width: 55px;
    }
    .month-content:hover,.month-content.active,.year-content.active,.year-content:hover{
        color: #409eff;
    }
    .year-content{
        width: 25%;
        text-align: center;
        padding: 16px 0px;
        cursor: pointer;
    }
</style>