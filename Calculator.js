Ext.define('Calculator', {

    config: {
        calculationType: undefined,
        field: undefined
    },

    constructor: function(config) {
        this.initConfig(config);
    },

    prepareChartData: function(store) {
      var that = this;
        var data = _.groupBy(store.getRange(), function(record) {
            var value = record.get(this.field);
            return _.isObject(value) ? value._refObjectName : value;
        }, this),
        categories = _.keys(data),
        seriesData;

        if(this.calculationType === 'count') {
            seriesData = _.map(data, function(value, key) {
              return [key, value.length];
            });
        } else {
            seriesData = _.map(data, function(value, key) {
                var planEstimateTotal = _.reduce(value, function(total, r) {
                  if(that.calculationType === 'leafplanest') {
                      return total + r.get('LeafStoryPlanEstimateTotal');
                    }else
                    if(that.calculationType === 'prelimest') {
                        return total + r.get('PreliminaryEstimateValue');
                      }else {
                      return total + r.get('PlanEstimate');
                    }
                }, 0);
                return [key, planEstimateTotal];
            });
        }

        return {
            categories: categories,
            series: [
                {
                    name: this.field,
                    type: this.seriesType,
                    data: seriesData
                }
            ]
        };
    }
});
