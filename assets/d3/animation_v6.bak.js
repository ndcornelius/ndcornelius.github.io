
      
    var height = 170;
	var width = 900;
	var margin = {top: 40, left: 50, right: 20, bottom: 30}
	var plotWidth = width/2.5;
	var height3 = 900;
	var width3 = 900;
	
	var renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
		renderer.setSize(height3, width3);
		d3. select("body")
			.append("div")
			.attr("id", "threevarplot")
			
		document.getElementById('threevarplot').appendChild(renderer.domElement);
		var camera = new THREE.PerspectiveCamera(45, height3 / width3, 1, 500);
		camera.position.set(0, 0, 100);
		//camera.lookAt(new THREE.Vector3(0, 0, 0));

      
		// Default data display
	d3.csv("sin_cos.csv", function (data) { 
			// Get the values in the first column and assigns them to keys
		var keys = d3.keys(data[0]);
		//var entries = d3.entries(data);
	
		draw(data);
	});
	
	function draw(data) {
		var keys = d3.keys(data[0]);
				
		oneVarPlot(data, 0, 1, "plot2");
		oneVarPlot(data, 0, 2, "plot1");
		twoVarPlot(data, 0, 1, 2, "twovarplot");
		threeVarPlot(data, 0, 1, 2);
	}

		// Function 
	function oneVarPlot(data, a, b, label) {
		
		var keys = d3.keys(data[0]);
	
		var x = { max: d3.max( data, function(d) {return +d[keys[a]];}),
					min: d3.min(data, function(d) {return +d[keys[a]];})}		
								
		var y = { max: d3.max(data, function(d) {return +d[keys[b]];}), 
					min: d3.min(data, function(d) {return +d[keys[b]];})}
					
		var duration = 1000*(x.max-x.min);
					
		if (duration > 10000) {
			duration = 10000
		}
							
		var xScale = d3.scale.linear()
				.domain([x.min, x.max])
				.range([0, width - margin.left - margin.right]);
				
		var yScale = d3.scale.linear()
				.domain([y.max, y.min])
				.range([0, height - margin.top - margin.bottom]);
				
		var xAxis = d3.svg.axis()
					.scale(xScale)
					.orient("bottom");
					
		var yAxis = d3.svg.axis()
					.scale(yScale)
					.orient("left")
					.ticks(5);
		
							
		var svg = d3.select("body")
			.attr("id", label)
			.append("svg")
			.attr("width", width)
			.attr("height", height)
			.append("g")
			.attr("transform", "translate(50, 10)");
			
		var line = d3.svg.line()
			.x(function (d) { return xScale(d[keys[a]])})
			.y(function (d) { return yScale(d[keys[b]])});
			
		var plot = svg.append("g")
			.append("path")
			.attr("d", line(data))
			.attr("class", "line");
			
		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis)
			.append("text")
				.attr("class", "axisLabel")
			  .attr("transform", "rotate(-90)")
			  .attr("y", -margin.left)
			  .attr("x", -(height - margin.top - margin.bottom)/2)
			  .attr("dy", ".71em")
			  .style("text-anchor", "end")
			  .text(keys[b]);;;
			
		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + (height-margin.bottom - margin.top) + ")")
			.call(xAxis)
			.append("text")
			.attr("class", "axisLabel")
			  .attr("y", margin.bottom)
			  .attr("x", (width - margin.right - margin.left)/2)
			  .attr("dy", ".71em")
			  .style("text-anchor", "end")
			  .text(keys[a]);;;
			
		var circle = svg.append("circle")
			.attr("r", 6);
			
			
		function transition() {
			circle.interrupt().transition()
				.duration(duration)
				.ease("linear")
				.attrTween("transform", translateOn(data, a, b, width, height))
				.each("end", transition);
		}
		
		transition();
	}

	
	
	function twoVarPlot(data, t, a, b, label) {
	
		var keys = d3.keys(data[0]);
	
		var x = { max: d3.max( data, function(d) {return +d[keys[a]];}),
					min: d3.min(data, function(d) {return +d[keys[a]];})}		
								
		var y = { max: d3.max(data, function(d) {return +d[keys[b]];}), 
					min: d3.min(data, function(d) {return +d[keys[b]];})}
					
		var t = { max: d3.max(data, function(d) {return +d[keys[t]];}), 
					min: d3.min(data, function(d) {return +d[keys[t]];})}
					
		var duration = 1000*(t.max-t.min);
							if (duration > 10000) {
			duration = 10000
		}
							
		var xScale = d3.scale.linear()
				.domain([x.min, x.max])
				.range([0, plotWidth - margin.left - margin.right]);
				
		var yScale = d3.scale.linear()
				.domain([y.max, y.min])
				.range([0, (plotWidth - margin.top - margin.bottom)]);
				
		var xAxis = d3.svg.axis()
					.scale(xScale)
					.orient("bottom")
					.ticks(7);
					
		var yAxis = d3.svg.axis()
					.scale(yScale)
					.orient("left")
					.ticks(7);
	
		var svg = d3.select("body").append("div")
			.attr( "id", "twovarplot")
			.append("svg")
				.attr("width", plotWidth + margin.left + margin.right)
				.attr("height", plotWidth + margin.left + margin.right)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
				
		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0, 0)")
			.call(yAxis)
			.append("text")
				.attr("class", "axisLabel")
			  .attr("transform", "rotate(-90)")
			  .attr("y", -margin.left)
			  .attr("x", -(plotWidth-margin.left-margin.right)/2)
			  .attr("dy", ".71em")
			  .style("text-anchor", "end")
			  .text(keys[a]);
			
		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + (plotWidth - margin.top - margin.bottom) + ")")
			.call(xAxis)
			.append("text")
				.attr("class", "axisLabel")
			  .attr("transform", "rotate(0)")
			  .attr("y", margin.bottom)
			  .attr("x", (plotWidth-margin.right-margin.left)/2)
			  .attr("dx", ".71em")
			  .style("text-anchor", "end")
			  .text(keys[b]);
		
		var line = d3.svg.line()
			.x(function(d) { return xScale(d[keys[a]]); })
			.y(function(d) { return yScale(d[keys[b]]); });
		
		var path =  svg.append("path")
		  .datum(data)
		  .attr("class", "line")
		  .attr("d", line);
		  
		  
		  
		  
		  
		 var circle = svg.append("circle")
			.attr("r", 5);

		function transition() {
			circle.interrupt().transition()
				.duration(duration)
				.attrTween("transform", translateOn(data, a, b, plotWidth, plotWidth))
				.ease("linear")
				.each("end", transition);
		}
				
		transition();
	}
	
	function threeVarPlot( data, a, b, t ) {
		/*renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
		renderer.setSize(800, 800);
		d3. select("body")
			.append("div")
			.attr("id", "threevarplot")
			
		document.getElementById('threevarplot').appendChild(renderer.domElement);
		camera = new THREE.PerspectiveCamera(45, 800 / 800, 1, 500);
		camera.position.set(0, 0, 100);
		//camera.lookAt(new THREE.Vector3(0, 0, 0));
		scene = new THREE.Scene();
		scene.add(camera);*/
		
		var scene = new THREE.Scene();
		scene.add(camera);
		
			var keys = d3.keys(data[0]);
				
				var x = { max: d3.max( data, function(d) {return +d[keys[b]];}),
					min: d3.min(data, function(d) {return +d[keys[b]];})}		
								
				var y = { max: d3.max(data, function(d) {return +d[keys[t]];}), 
							min: d3.min(data, function(d) {return +d[keys[t]];})}
							
				var t = { max: d3.max(data, function(d) {return +d[keys[a]];}), 
							min: d3.min(data, function(d) {return +d[keys[a]];})}
									
				var xScale = d3.scale.linear()
						.domain([x.min, x.max])
						.range([-15, 15]);
						
				var yScale = d3.scale.linear()
						.domain([y.max, y.min])
						.range([-15, 15]);
						
				var tScale = d3.scale.linear()
						.domain([t.max, t.min])
						.range([-25, 25]);
						
				var geometry = new THREE.Geometry();
				var material = new THREE.LineBasicMaterial({
					color: 0x333333
					//color: 0x4682b4
				});
				for (var i=0; i<data.length; i++) {
				
					var entry = data[i];
					var p1 = tScale(entry[keys[0]]);
					var p2 = xScale(entry[keys[1]]);
					var p3 = yScale(entry[keys[2]]);
					geometry.vertices.push(new THREE.Vector3(p1, p2, p3));
				}
			
				var line = new THREE.Line(geometry, material);
				scene.add(line);
				
				
				controls = new THREE.TrackballControls( camera );
				controls.target.set( 0, 0, 0 );
				
				function animate() {
					
				requestAnimationFrame(animate);
				renderer.render(scene, camera);
				controls.update();
				}
				
				animate();
	}
	
	
	function translateOn(data, u, v, width, height) {
		var keys = d3.keys(data[0]);
		
		var scale = d3.scale.linear()
			.domain([0, 1])
			.range([0, data.length - 1]);
			
		var uScale = d3.scale.linear()
			.domain(d3.extent(data, function(d) {return +d[keys[u]]}))
			.range([0, width -margin.left-margin.right]);
			
		var vScale = d3.scale.linear()
			.domain(d3.extent(data, function(d) {return +d[keys[v]]}).reverse())
			.range([0, height - margin.top - margin.bottom]);
			
		var time, x, y, row;
			
		return function(d, i, a) {
			return function(t) {
				time = Math.floor(scale(t));
				row = data[time];
				x = uScale(row[keys[u]]);
				y = vScale(row[keys[v]]);
					
				return "translate(" + x + "," + y + ")";
				}
			}
	}
	
	
	
	
	
	openFile("uploader");
	
	function loadData(csv) {
		var data = d3.csv.parse(csv) ;		
		d3.selectAll("svg").remove();
		draw(data);
	}
	// Code to open the user uploaded file using HTML5 FileReader
	function openFile(element) {
		var input = document.getElementById(element);
		var reader = new FileReader();
		
		reader.onload = function(e) {
			var text = e.target.result;
			loadData(text);
		}
		
		uploader.addEventListener("change", handleFile, false);
		
		function handleFile() {
			var file = this.files[0];
			reader.readAsText(file);
		}
	}
	
     