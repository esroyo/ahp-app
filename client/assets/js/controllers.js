(function() {
    'use strict';

    angular.module('application')
        .controller('EvaluationController', EvaluationController)
        .controller('HierarchyController', HierarchyController);

    EvaluationController.$inject = ['$scope', '$stateParams', '$state', '$controller'];
    function EvaluationController($scope, $stateParams, $state, $controller) {
        angular.extend(this,
            $controller('DefaultController', {
                $scope: $scope,
                $stateParams: $stateParams,
                $state: $state
            }));

        this.data = {
            slug: 'test-23'
        };
    }

    HierarchyController.$inject = ['$scope', '$stateParams', '$state', '$controller', '_'];
    function HierarchyController($scope, $stateParams, $state, $controller, _) {

        var self = this;

        angular.extend(self,
            $controller('DefaultController', {
                $scope: $scope,
                $stateParams: $stateParams,
                $state: $state
            }));

        self.showHelp = false;
        self.newNode = {};

        self.name = 'Test';
        self.tree = new TreeModel();
        self.root = self.tree.parse(
			{name: 'General', children: [
                {name: 'Estetica', children: [
                    {name: 'Est1'},
                    {name: 'Est2'}
                ]},
                {name: 'Seguretat'},
                {name: 'Preu'},
            ]}
        );

        window.__mine = self.root;

        self.addNewNode = function () {
            console.log(self.newNode);
        };

        var getId = self.getId = function (node) {
            return node.model.name;
        }

        var isEqual = self.isEqual = function (node, otherNode) {
            return getId(node) === getId(otherNode);
        };

        var formatPath = self.formatPath = function (node) {
            return _.map(node.getPath(), getId).join(' » ');
        }

        function getParent(node) {
            return self.root.first(function (other) {
                return other.hasChildren() &&
                    _.includes(_.map(other.children, getId), getId(node));
            });
        };

        function getSiblings(node) {
            var parent = getParent(node);
            return parent && _.differenceWith(parent.children, [node], isEqual);
        }

        self.select = function ($event) {
            var name = _.trim($($event.currentTarget).text());
            self.currentNode = self.root.first(function (node) {
                return node && getId(node) === name;
            });

            self.newNode.parent = getId(self.currentNode);
            self.currentNodePath = formatPath(self.currentNode);
            self.currentNodeParent = getParent(self.currentNode);
            self.currentNodeSiblings = getSiblings(self.currentNode);
        };

        self.currentNode = self.root;
        self.newNode.parent = getId(self.currentNode);
        self.currentNodePath = formatPath(self.currentNode);
        self.currentNodeParent = getParent(self.currentNode);
        self.currentNodeSiblings = getSiblings(self.currentNode);

        self.root.all(function (node) {
            if (!node.model.comparisons) {
                node.model.comparisons = {};
            }

            _.each(getSiblings(node), function (sibling) {
                var siblingId = getId(sibling);
                if (node.model.comparisons[siblingId] === undefined) {
                    node.model.comparisons[siblingId] = 0;
                }
            });
        });
    }

}());
