// JavaScript source code
let type=null;
let price=0;
function processPlan(planId){
	if(planId==1){
		type= " Landing Page";
		price= 5600;
	} else if(planId==2){
		type=" Portfolio Website";
		price= 7600;
	} else if(planId==3){
		type=" Blog Site";
		price=16600;
	} else if(planId==4){
		type=" Standard Business Website";
		price=27000;
	} else if(planId==5){
		type=" E- Commerce";
		price=59000;
	} else if(planId==6){
		type=" Corporate";
		price=220000;
	} else {
		alert("Invalid query!" );
		return;
	}
	openPlan(type, price);
}

function populate(){
	const planquery= window.location.search;
	const urlParams= new URLSearchParams(planquery);

	const planType= urlParams.get('type');
	const planPrice= urlParams.get('price');
}
function openPlan(type, price){
	const url= `plans/openplan.html?type= ${type}&& price= ${price)`;
}