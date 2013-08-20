minispade.register('stats', function() {

  /**
   * @class
   */
  RiakControl.StatsView = Ember.View.extend(
    /** @scope RiakControl.StatsView.prototype */ {
    templateName: 'stats'
  });

  /**
   * @class
   *
   * StatsController is responsible for displaying graphs related
   * to cluster statistics.
   */
  RiakControl.StatsController = Ember.Controller.extend(
    /**
     * Shares properties with RiakControl.ClusterController
     */
    RiakControl.ClusterAndNodeControls,
    /** @scope RiakControl.NodesController.prototype */ {

    /**
     * Reloads the record array associated with this controller.
     *
     * @returns {void}
     */
    reload: function() {
      this.get('content').reload();
    }
  });

  /**
   * @class
   *
   * Content for the add graph dropdown menu.
   */
  RiakControl.AddGraphSelectView = Ember.Select.extend({
    content: [
      '-- Choose a Statistic --',
      'KV - cpu_avg1',
      'KV - cpu_avg5',
      'KV - cpu_avg15',
      'KV - cpu_nprocs',
      'KV - node_get_fsm_active',
      'KV - node_get_fsm_active_60s',
      'KV - node_get_fsm_in_rate',
      'KV - node_get_fsm_objsize_95',
      'KV - node_get_fsm_objsize_99',
      'KV - node_get_fsm_objsize_100',
      'KV - node_get_fsm_objsize_mean',
      'KV - node_get_fsm_objsize_median',
      'KV - node_get_fsm_out_rate',
      'KV - node_get_fsm_rejected',
      'KV - node_get_fsm_rejected_60s',
      'KV - node_get_fsm_rejected_total',
      'KV - node_get_fsm_siblings_95',
      'KV - node_get_fsm_siblings_99',
      'KV - node_get_fsm_siblings_100',
      'KV - node_get_fsm_siblings_mean',
      'KV - node_get_fsm_siblings_median',
      'KV - node_get_fsm_time_95',
      'KV - node_get_fsm_time_99',
      'KV - node_get_fsm_time_100',
      'KV - node_get_fsm_time_mean',
      'KV - node_get_fsm_time_median',
      'KV - node_gets',
      'KV - node_gets_total',
      'KV - node_put_fsm_active',
      'KV - node_put_fsm_active_60s',
      'KV - node_put_fsm_in_rate',
      'KV - node_put_fsm_out_rate',
      'KV - node_put_fsm_rejected',
      'KV - node_put_fsm_rejected_60s',
      'KV - node_put_fsm_rejected_total',
      'KV - node_put_fsm_time_95',
      'KV - node_put_fsm_time_99',
      'KV - node_put_fsm_time_100',
      'KV - node_put_fsm_time_mean',
      'KV - node_put_fsm_time_median',
      'KV - node_puts',
      'KV - node_puts_total'
    ]
  });

  // Remove graphs when you click the remove button.
  $(document).on('click', '.remove-graph', function () {
    var relevantClass = $(this).attr('class').match(/marker\d+/)[0];
    $('.' + relevantClass).remove();
  });

  /**
   * @class
   *
   * Time Series mixin.
   */
  RiakControl.TimeSeries = Ember.Object.extend(
    /** @scope RiakControl.TimeSeries.prototype */ {

    id: 0,
    areaSelector: '#graphs',
    duration: 500,
    title: 'statName',

    /**
     * Random data generator.
     */
    random: d3.random.normal(.5, .2),

    /**
     * X-axis range.
     */
    xMin: 1,
    xMax: 100,

    /**
     * Time series margins.
     */
    marginTop: 20,
    marginRight: 20,
    marginBottom: 20,
    marginLeft: 40,

    /**
     * Time series dimensions.
     */
    width: function () {
      return 960 - this.get('marginLeft') - this.get('marginRight');
    }.property('marginLeft', 'marginRight'),

    height: function () {
      return 300 - this.get('marginTop') - this.get('marginBottom');
    }.property('marginTop', 'marginBottom'),

    /**
     * Axes
     */
    xAxis: function () {
      return d3.scale.linear()
                     .domain([this.get('xMin'), this.get('xMax') - 2])
                     .range([0, width]);
    }.property('xMin', 'xMax'),

    yAxis: function () {
      return d3.scale.linear()
                     .domain([0, 1])
                     .range([this.get('height'), 0]);
    }.property('height'),

    /**
     * For drawing a line on the graph.
     */
    line: function () {
      return d3.svg.line()
                   .interpolate('basis')
                   .x(function(d, i) { return this.get('xAxis')(i); })
                   .y(function(d, i) { return this.get('yAxis')(d); });
    }.property('xAxis', 'yAxis'),

    /**
     * Initial data.
     */
    data: function () {
      return d3.range(this.get('xMax')).map(this.get('random'));
    }.property('xMax', 'random'),

    /**
     * Header controls.
     */
    heading: function () {
      var areaSelector = this.get('areaSelector'),
          id = this.get('id');

      $('#' + areaSelector).append(
        '<h2 class="marker' + id + '">' + this.get('title') + '</h2>');
      $('#' + areaSelector).append(
        '<a class="remove-graph marker' + id + '">remove this graph</a>');
    }.property('areaSelector', 'id', 'title'),

    /**
     * The svg element
     */
    svg: function () {
      var id = this.get('id'),
          width = this.get('width'),
          height = this.get('height'),
          marginLeft = this.get('marginLeft'),
          marginTop = this.get('marginTop'),
          yAxis = this.get('yAxis');

      return d3.select("#" + this.get('areaSelector')).append("svg")
               .attr("class", "marker" + id)
               .attr("width",
                   width + marginLeft + this.get('marginRight'))
               .attr("height",
                   height + marginTop + this.get('margin.bottom'))
             
              .append("g")
                .attr("transform", 
                      "translate(" + marginLeft + "," + marginTop + ")")

              .append("defs")

              .append("clipPath")
                .attr("id", "clip" + id)
              
              .append("rect")
                .attr("width", width)
                .attr("height", height)

              .append("g")
                .attr("class", "x axis xaxis" + id)
                .attr("transform", "translate(0," + yAxis(0) + ")")
                .call(d3.svg.axis().scale(this.get('xAxis')).orient("bottom"))

              .append("g")
                .attr("class", "y axis yaxis" + id)
                .call(d3.svg.axis().scale(yAxis).orient("left"));
    
    }.property('areaSelector', 'id',
               'width', 'height',
               'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
               'xAxis', 'yAxis'),

    /**
     * The path element.
     */
    path: function () {
      return this.get('svg')
        .append("g")
          .attr("clip-path", "url(#clip" + this.get('id') + ")")
        .append("path")
          .datum(this.get('data'))
          .attr("class", "line")
          .attr("d", this.get('line'));
    }.property('svg', 'id', 'data', 'line'),

    /**
     * Function for animating the graph
     */
    tick: function () {
      var newx,
          newXMin = this.get('xMin') + 1,
          newXMax = this.get('xMax') + 1,
          id = this.get('id'),
          data = this.get('data'),
          duration = this.get('duration'),
          recurse = this.tick;

      // Make sure the graph hasn't been removed.
      var stillExists = $('.marker' + id).length;

      // If the graph hasn't been removed, redraw stuff.
      if (stillExists) {

        // push a new data point onto the back
        data.push(this.get('random')());

        // redraw the line, and slide it to the left
        this.get('path')
              .attr("d", this.get('line'))
              .attr("transform", null)
            .transition()
              .duration(duration)
              .ease("linear")
              .attr("transform", "translate(" + this.get('xAxis')(0) + ",0)")
              .each("end", function () { return recurse() });

        newx = d3.scale.linear()
                       .domain([newXMin, newXMax - 2])
                       .range([0, this.get('width')]);

        d3.select(".xaxis" + id)
          .transition()
          .duration(duration)
          .ease('linear')
          .call(d3.svg.axis().scale(newx).orient('bottom'));
       
        // pop the old data point off the front
        data.shift();
      }
    }
  });



  /**
   * An object for creating time series graphs.
   */
  RiakControl.StatGraphCreator = Ember.Object.create({

    /**
     * Tracks the selected option in RiakControl.AddGraphSelectView.
     */
    selectedStat: '',

    /**
     * Holds each graph object.
     */
    graph: '',

    /**
     * Function for creating a new graph.
     */
    createGraph: function () {

      /*
       * Get the stat name and clean stuff like "KV - " off the front of it.
       */
      var selected = this.get('selectedStat').replace(/^[^\s]+\s+\-\s+/, '');

      /*
       * If the selected item is not the default option...
       */
      if (selected !== '-- Choose a Statistic --') {
        
        /*
         * Create a new graph (doesn't work).
         */
        var wtf = RiakControl.TimeSeries.create();
        console.log(wtf)

        /*
         * Set the dropdown back to the default option.
         */
        $('#add-new-graph select').find('option:first')
                                  .attr('selected', 'selected');
      }
    }.observes('selectedStat')
  });

});
