minispade.register('router', function() {

  /**
   * @class
   *
   * Base application router for the RiakControl application.  At this
   * point its responsibilities include either rendering the new pure
   * ember-only components, or using the legacy pub/sub implementation
   * to render older pages which are scheduled for deprecation.
   */
  RiakControl.Router = Ember.Router.extend(
    /** @scope RiakControl.Router.prototype */ {

    root: Ember.Route.extend({
      showSnapshot: Ember.Route.transitionTo('snapshot.index'),

      showCluster: Ember.Route.transitionTo('cluster.index'),

      showNodes: Ember.Route.transitionTo('nodes.index'),

      showRing: Ember.Route.transitionTo('ring.index'),

      showStats: Ember.Route.transitionTo('stats.index'),

      index: Ember.Route.extend({
        route: '/',
        redirectsTo: 'snapshot.index'
      }),

      /**
       * Route code for the snapshot page.
       */
      snapshot: Ember.Route.extend({
        route: 'snapshot',

        connectOutlets: function(router) {
          router.get('applicationController').
            connectOutlet('snapshot', RiakControl.Node.find());
          $.riakControl.markNavActive('nav-snapshot');
        },

        enter: function(router) {
          router.get('snapshotController').startInterval();
        },

        exit: function(router) {
          router.get('snapshotController').cancelInterval();
        },

        index: Ember.Route.extend({
          route: '/'
        })
      }),

      /**
       * Route code for the cluster page.
       */
      cluster: Ember.Route.extend({
        route: 'cluster',

        connectOutlets: function(router) {
          router.get('applicationController').connectOutlet('cluster',
            RiakControl.CurrentAndPlannedCluster.create({
              stagedCluster: [], currentCluster: []
            }));

          $.riakControl.markNavActive('nav-cluster');
        },

        enter: function(router) {
          router.get('clusterController').startInterval();
        },

        exit: function(router) {
          router.get('clusterController').cancelInterval();
        },

        index: Ember.Route.extend({
          route: '/'
        })
      }),

      /**
       * Route code for the nodes page.
       */
      nodes: Ember.Route.extend({
        route: 'nodes',

        connectOutlets: function(router) {
          router.get('applicationController').
            connectOutlet('nodes', RiakControl.Node.find());
          $.riakControl.markNavActive('nav-nodes');
        },

        enter: function(router) {
          router.get('nodesController').startInterval();
        },

        exit: function(router) {
          router.get('nodesController').cancelInterval();
        },

        index: Ember.Route.extend({
          route: '/'
        })
      }),

      /**
       * Route code for the ring page.
       */
      ring: Ember.Route.extend({
        route: 'ring',

        connectOutlets: function(router) {
          router.get('applicationController').
            connectOutlet('ring', RiakControl.Partition.find());
          $.riakControl.markNavActive('nav-ring');
        },

        enter: function(router) {
          router.get('ringController').startInterval();
        },

        exit: function(router) {
          router.get('ringController').cancelInterval();
        },

        index: Ember.Route.extend({
          route: '/'
        })
      }),

      /**
       * Route code for the stats page.
       */
      stats: Ember.Route.extend({
        route: 'stats',

        connectOutlets: function(router) {
          router.get('applicationController').
            connectOutlet('stats', RiakControl.Node.find());
          $.riakControl.markNavActive('nav-stats');
        },

        enter: function(router) {
          router.get('statsController').startInterval();
        },

        exit: function(router) {
          router.get('statsController').cancelInterval();
        },

        index: Ember.Route.extend({
          route: '/'
        })
      })
    })
  });

});
