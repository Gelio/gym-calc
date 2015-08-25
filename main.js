(function() {
    var gymCalc = angular.module("gymCalc", []);

    gymCalc.controller("CalcCtrl", ["$scope", function($scope) {
        $scope.totalWeight = 0;
        $scope.plates = [
            {
                weight: 0,
                amount: 0
            },
            {
                weight: 0,
                amount: 0
            }
        ];

        $scope.newPlate = {
            weight: 0,
            amount: 0
        };

        $scope.addNewPlate = function() {
            $scope.plates.push(Object.create($scope.newPlate));
        };

        $scope.removeLastPlate = function() {
            $scope.plates.splice($scope.plates.length-1, 1);
        };

        $scope.calculate = function() {
            /*$scope.plates.forEach(function(value, index) {
                if(value.weight === null && value.amount === null) {
                    $scope.plates.splice(index, 1);
                }
            });*/

            console.log($scope.plates);
        };
    }]);
})();