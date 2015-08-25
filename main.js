(function() {
    var gymCalc = angular.module("gymCalc", []);

    gymCalc.controller("CalcCtrl", ["$scope", function($scope) {
        $scope.totalWeight = 0;
        $scope.barWeight = 0;
        $scope.achievable = false;
        $scope.unachievable = false;
        $scope.closestPossible = 0;
        $scope.lowerThanSmallest = false;
        $scope.plates = [];
        $scope.output = [];

        $scope.newPlate = new Plate(10, 2);

        $scope.addNewPlate = function() {
            $scope.plates.push($scope.newPlate.clone());
        };

        for(var i=0; i < 2; ++i)
            $scope.addNewPlate();

        $scope.removeLastPlate = function() {
            $scope.plates.splice($scope.plates.length-1, 1);
        };

        $scope.calculate = function() {
            // Everything is divided by 2 (weightLeft and plates amounts in a forEach) so that we only count per-side weight
            var platesSorted = [],
                weightLeft = ($scope.totalWeight-$scope.barWeight)/2;
            //console.log(weightLeft);

            $scope.output = [];
            $scope.achievable = false;
            $scope.unachievable = false;
            $scope.lowerThanSmallest = false;

            if($scope.totalWeight == 0)
                return;

            if(weightLeft <= 0) {
                $scope.lowerThanSmallest =  true;
                return;
            }

            $scope.plates.forEach(function(value) {
                platesSorted.push(value.clone());
            });

            //console.log("before sorting", platesSorted.map(function(plate) {return plate.weight;}));
            platesSorted = platesSorted.sort(function(a, b) {
                /*if(a.weight > b.weight)
                    return -1;
                else if(a.weight == b.weight)
                    return 0;
                else
                    return 1;*/
                return b.weight-a.weight;
            });
            //console.log("after sorting", platesSorted.map(function(plate) {return plate.weight;}));

            for(var i=1; i < platesSorted.length; ++i) {
                if(platesSorted[i].weight == platesSorted[i-1].weight) {
                    platesSorted[i-1].amount += platesSorted[i].amount;
                    platesSorted.splice(i, 1);
                    --i;
                }
            }
            //console.log(platesSorted);

            platesSorted.forEach(function(plate, index) {
                var availablePlates = Math.floor(plate.amount/2),
                    sideWeight = plate.weight;
                if(weightLeft >= sideWeight) {
                    var amount = Math.floor(weightLeft / sideWeight);
                    if(amount > availablePlates)
                        amount = availablePlates;

                    weightLeft -= amount*sideWeight;
                    $scope.output.push(new Plate(plate.weight, amount));
                }
            });
            if(weightLeft*2 == $scope.totalWeight) {
                $scope.lowerThanSmallest = true;
            }
            else if(weightLeft != 0) {
                $scope.unachievable = true;
                $scope.closestPossible = $scope.totalWeight-weightLeft*2;
            }
            else if(weightLeft == 0) {
                $scope.achievable = true;
            }

            //console.log(weightLeft);
        };

        $scope.saveSettings = function() {
            localStorage.setItem("plates", JSON.stringify($scope.plates));
            /*console.log($scope.plates);
            console.log(JSON.stringify($scope.plates));*/

            localStorage.setItem("bar", $scope.barWeight);
        };

        $scope.loadSettings = function() {
            var barWeight = localStorage.getItem("bar");

            if(barWeight !== undefined) {
                $scope.barWeight = parseFloat(barWeight);

                var parsedPlates = JSON.parse(localStorage.getItem("plates"));

                $scope.plates = [];
                parsedPlates.forEach(function(plate) {
                    $scope.plates.push(new Plate(plate.weight, plate.amount));
                });
            }
        }
    }]);
})();