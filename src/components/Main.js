require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

//let yeomanImage = require('../images/1.jpg');
var imageDatas = require('json-loader!../data/imageDatas.json');

var imageDatas = (function(imageDatasArr) {
	for (var i = 0, j = imageDatasArr.length; i < j; i++) {
		var singleImageData = imageDatasArr[i];

		singleImageData.imageURL = require('../images/' + singleImageData.fileName);

		imageDatasArr[i] = singleImageData;
	}

	return imageDatasArr;
})(imageDatas);

/*
 * 获取区间内的一个随机值
 */
function getRangeRandom(low, high) {
    return Math.ceil(Math.random() * (high - low) + low);
}
/*
 * 获取 0~30° 之间的一个任意正负值
 */
function get30DegRandom() {
  return ((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30));
}

class ImgFigure extends React.Component {

	handleClick(e){
		if(this.props.arrange.isCenter){
			this.props.inverse();
		}else{
			this.props.center();
		}
		e.stopPropagation();
		e.preventDefault();
	}


	render() {
		var styleObj = {};
		if(this.props.arrange.pos){
			styleObj = this.props.arrange.pos;
		}
		//如果图片的旋转角度不为0，添加旋转的角度
		if(this.props.arrange.rotate){
			
			(['MozTransform', 'msTransform', 'WebkitTransform', 'transform']).forEach(function(value){
				styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)';
			}.bind(this));
			
		}

		//这种写法在firefox 15 会无法使用
/*		if(this.props.arrange.rotate){

			(['-moz-', '-ms-', '-webkit-', '']).forEach(function(value){
				styleObj[value + 'transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
			}.bind(this));
			
		}
*/
		var imgFigureClassName = "img-figure";
			imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse': '';
			imgFigureClassName += this.props.arrange.isCenter ? ' is-center': '';
		return ( 
			<figure className = {imgFigureClassName} 
					style={styleObj} onClick={this.handleClick.bind(this)}>
				<img src = {this.props.data.imageURL}
					alt = {this.props.data.title} /> 
				<figcaption>
					<h2 className = "img-title" > 
					{this.props.data.title} 
					</h2> 
					<div className="img-back" onClick={this.handleClick.bind(this)}>
					<p >
						{this.props.data.desc}
					</p> 
					</div> 
				</figcaption> 
			</figure> 
		);
	}
}


class ControllerUnit extends React.Component{
	handleClick(e){
		if(this.props.arrange.isCenter){
			this.props.inverse();
		}else{
			this.props.center();
		}
		e.preventDefault();
		e.stopPropagation();
	}

	render(){

		var controllerUnitClassName = "controller-unit";
		if(this.props.arrange.isCenter){
			controllerUnitClassName += " is-center";

			if(this.props.arrange.isInverse){
				controllerUnitClassName += " is-inverse";
			}
		}
		return (
			<span className={controllerUnitClassName} onClick={this.handleClick.bind(this)}></span>
		)
	}
}

class AppComponent extends React.Component {

			constructor(){
				var Constant={
					centerPos:{
						left:0,
						right:0
					},
					hPosRange:{ 	//水平方向的取值范围
						leftSecX:[0,0],
						rightSecX:[0,0],
						y:[0,0]
					},
					vPosRange:{		//垂直方向的取值范围
						x:[0,0],
						topY:[0,0]
					}
				}
				super();
				this.Constant = Constant;
				this.state = {imgsArrangeArr:[/*{
					pos:{
						left:'0',
						top:'0'
					},
					rotate:0,	//旋转角度
					isInverse: false  //图片正反面
					
				}*/]};
			}

			/*
			* 翻转图片
			*
			*/

			inverse(index){
				return function(){
					var imgsArrangeArr = this.state.imgsArrangeArr;
					
				imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

					this.setState({
						imgsArrangeArr:imgsArrangeArr
					});
		
				}.bind(this);
			}

			center(index){
				return function(){
					this.rearrange(index);
				}.bind(this);
			}

		  /*
		   * 重新布局所有图片
		   * @param centerIndex 指定居中排布哪个图片
		   */
		  rearrange(centerIndex) {
		    var imgsArrangeArr = this.state.imgsArrangeArr,
		        Constant = this.Constant,
		        centerPos = Constant.centerPos,
		        hPosRange = Constant.hPosRange,
		        vPosRange = Constant.vPosRange,
		        hPosRangeLeftSecX = hPosRange.leftSecX,
		        hPosRangeRightSecX = hPosRange.rightSecX,
		        hPosRangeY = hPosRange.y,
		        vPosRangeTopY = vPosRange.topY,
		        vPosRangeX = vPosRange.x,

		        imgsArrangeTopArr = [],
		        topImgNum = Math.floor(Math.random() * 2),    // 取一个或者不取,ceil向上取整，floor向下取整
		        topImgSpliceIndex = 0,

		        imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

		        // 首先居中 centerIndex 的图片, 居中的 centerIndex 的图片不需要旋转
		        imgsArrangeCenterArr[0] = {
		          pos: centerPos,
		          rotate: 0,
		          isCenter: true
		        };

		        // 取出要布局上侧的图片的状态信息
		        topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
		        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

		        // 布局位于上侧的图片
		        imgsArrangeTopArr.forEach(function (value, index) {
		            imgsArrangeTopArr[index] = {
		              pos: {
		                  top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
		                  left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
		              },
		              rotate: get30DegRandom(),
		              isCenter: false
		            };
		        });

		        // 布局左右两侧的图片
		        for (var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
		            var hPosRangeLORX = null;

		            // 前半部分布局左边， 右半部分布局右边
		            if (i < k) {
		                hPosRangeLORX = hPosRangeLeftSecX;
		            } else {
		                hPosRangeLORX = hPosRangeRightSecX;
		            }

		            imgsArrangeArr[i] = {
		              pos: {
		                  top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
		                  left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
		              },
		              rotate: get30DegRandom(),
		              isCenter: false
		            };

		        }

		        if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
		            imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
		        }

		        imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

		        this.setState({
		            imgsArrangeArr: imgsArrangeArr
		        });
		  }

		//组件加载后，为每张图片计算范位置的范围
		componentDidMount(){
			var Constant = this.Constant;
			
			//首先拿到舞台的大小
		    var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
		        stageW = stageDOM.scrollWidth,
		        stageH = stageDOM.scrollHeight,
		        halfStageW = Math.ceil(stageW / 2),
		        halfStageH = Math.ceil(stageH / 2);
		    
		    // 拿到一个imageFigure的大小
		    var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
		        imgW = imgFigureDOM.scrollWidth,
		        imgH = imgFigureDOM.scrollHeight,
		        halfImgW = Math.ceil(imgW / 2),
		        halfImgH = Math.ceil(imgH / 2);

		    // 计算中心图片的位置点
		    Constant.centerPos = {
		        left: halfStageW - halfImgW,
		        top: halfStageH - halfImgH
		    };
		    console.log(Constant.centerPos);
		    console.log("halfStageW:"+halfStageW);
		    console.log("halfImgW:"+halfImgW);
		    console.log("imgFigureDOM:"+imgFigureDOM);
		    console.log("stageDOM:"+stageDOM);
		    // 计算左侧，右侧区域图片排布位置的取值范围
		    Constant.hPosRange.leftSecX[0] = -halfImgW;
		    Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
		    Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
		    Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
		    Constant.hPosRange.y[0] = -halfImgH;
		    Constant.hPosRange.y[1] = stageH - halfImgH;

		    // 计算上侧区域图片排布位置的取值范围
		    Constant.vPosRange.topY[0] = -halfImgH;
		    Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
		    Constant.vPosRange.x[0] = halfStageW - imgW;
		    Constant.vPosRange.x[1] = halfStageW;

		    this.rearrange(0);
			
		}

		render() {
			var controllerUnits = [],
				imgFigures = [];

			imageDatas.forEach(function(value,index) {
				if(!this.state.imgsArrangeArr[index]){
					this.state.imgsArrangeArr[index]={
						pos: {
		                    left: 0,
		                    top: 0
		                },
		                rotate: 0,
		                isInverse: false,
		                isCenter: false
					}
				}
				imgFigures.push( <ImgFigure  key={index}
							data = {value} 
							ref={'imgFigure' + index} 
							arrange={this.state.imgsArrangeArr[index]}
							inverse={this.inverse(index)} 
							center={this.center(index)}
							/>);


				controllerUnits.push(<ControllerUnit  
										key={index} 
										arrange={this.state.imgsArrangeArr[index]} 
										inverse={this.inverse(index)} 
										center={this.center(index)}
										/>);
			}.bind(this));
				/*  	for(var obj in imageDatas){
				  		imgFigures.push(<ImgFigure data={obj} />);
				  	}*/

				return ( <div>
					<section className = "stage" ref="stage" >
						<section className = "img-sec" > 
							{imgFigures} 
						</section> 
						<nav className = "controller-nav" > 
							{controllerUnits}
						</nav>
					</section> 
				</div>);
		}
}

		AppComponent.defaultProps = {};

		export default AppComponent;