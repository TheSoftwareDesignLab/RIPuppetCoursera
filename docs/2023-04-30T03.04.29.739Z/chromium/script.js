var svg = d3.select("svg"),
  width = +svg.attr("width"),
  height = +svg.attr("height");

var color = d3.scaleOrdinal(d3.schemeCategory20);

var simulation = d3
  .forceSimulation()
  .force(
    "link",
    d3.forceLink().id(function (d) {
      return d.state;
    })
  )
  .force("charge", d3.forceManyBody().strength(-500))
  .force("center", d3.forceCenter(width / 2, height / 2));

d3.json("graph3.json", function (error, graph) {
  if (error) throw error;

  var link = svg
    .append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter()
    .append("line")
    .attr("stroke-width", function (d) {
      return 4;
    });

  var node = svg
    .append("g")
    .attr("class", "nodes")
    .selectAll("g")
    .data(graph.nodes)
    .enter()
    .append("g");

  var circles = node
    .append("circle")
    .attr("r", 10)
    .attr("fill", function (d) {
      if (d.errors.length === 0) {
        return "skyblue";
      }
      return "red";
    })
    .call(
      d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    );

  var lables = node
    .append("text")
    .text(function (d) {
      return d.state;
    })
    .attr("x", 6)
    .attr("y", 3);

  node.append("title").text(function (d) {
    return d.state;
  });

  //Click Interaction
  node.on("click", function (object) {
    console.log(object);
    document.getElementById("stateName").innerHTML = "State #" + object.state;
    document.getElementById("stateImage").classList.remove("hidden");
    document.getElementById("stateImage").src =
      "screenshots/" + object.state + ".png";
    document.getElementById("elementType").innerHTML = "State";
    document.getElementById("urlOrTransition").innerHTML = "URL";
    document.getElementById("errorsRow").classList.remove("hidden");
    document.getElementById("errorsNumber").classList.remove("hidden");
    document.getElementById("errorsTitle").classList.remove("hidden");

    document.getElementById("errorsNumber").innerHTML = object.errors.length;

    if (object["url"]) {
      document.getElementById("stateUrl").innerHTML = object.url;
    } else {
      document.getElementById("stateUrl").innerHTML = "-";
    }

    showErrors(object.errors);
  });

  link.on("click", function (object) {
    console.log(object);
    document.getElementById("stateName").innerHTML =
      "Transition " + object.source.state + " - " + object.target.state;
    //document.getElementById('stateImage').classList.add('hidden');
    document.getElementById("stateImage").src =
      "screenshots/state_" +
      object.source.state +
      "_interaction_" +
      object.target.state +
      "BEFORE.png";
    document.getElementById("elementType").innerHTML = "Transition";
    document.getElementById("urlOrTransition").innerHTML = "Transition type";
    document.getElementById("errorsRow").classList.add("hidden");
    document.getElementById("errorsNumber").classList.add("hidden");
    document.getElementById("errorsTitle").classList.add("hidden");

    if (object["interaction"]) {
      document.getElementById("stateUrl").innerHTML = object.interaction;
    }
  });

  //Hover Interaction
  link.on("mouseover", function (object) {
    var sel = d3.select(this);
    console.log(sel);

    link.append("title").text(function (d) {
      return d.interaction;
    });
  });

  simulation.nodes(graph.nodes).on("tick", ticked);

  simulation.force("link").links(graph.links);

  function ticked() {
    link
      .attr("x1", function (d) {
        return d.source.x;
      })
      .attr("y1", function (d) {
        return d.source.y;
      })
      .attr("x2", function (d) {
        return d.target.x;
      })
      .attr("y2", function (d) {
        return d.target.y;
      });

    node.attr("transform", function (d) {
      return "translate(" + d.x + "," + d.y + ")";
    });
  }
});

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

function showErrors(errorList) {
  let errorContainer = document.getElementById("errorMessageContainer");

  while (errorContainer.hasChildNodes()) {
    errorContainer.removeChild(errorContainer.lastChild);
  }

  //    errorList.forEach(element => {
  //      let node = document.createElement("DIV");
  //      node.innerHTML = element.message;
  //      node.classList.add("alert");
  //      node.classList.add("alert-danger");
  //      node.setAttribute("role", "alert");
  //      document.getElementById('errorMessageContainer').appendChild(node);

  //    });

  errorList.forEach((element) => {
    let node = document.createElement("CODE");
    node.innerHTML = element;
    node.classList.add("prettyprint");
    document.getElementById("errorMessageContainer").appendChild(node);
    let jump = document.createElement("br");
    let jump2 = document.createElement("br");
    document.getElementById("errorMessageContainer").appendChild(jump);
    document.getElementById("errorMessageContainer").appendChild(jump2);
  });
}
