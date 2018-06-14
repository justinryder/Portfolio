;(function(ko) {
  'use strict';

  function NavigationItemViewModel(options) {
    var self = this

    self.link = options.link
    self.className = options.className
    self.subitems = options.subitems
    self.name = options.name
  }

  function NavigationViewModel(options) {
    var self = this

    self.items = options.items
  }

  var navigationViewModel = new NavigationViewModel({
    items: [
      new NavigationItemViewModel({
        link: '/snowflakes.html',
        name: 'Snowflakes',
        className: 'navigation__link--snowflakes'
      }),
      new NavigationItemViewModel({
        link: '/magnets.html',
        name: 'Magnets',
        className: 'navigation__link--magnets'
      }),
      new NavigationItemViewModel({
        link: '/liquids.html',
        name: 'Liquids',
        className: 'navigation__link--liquids',
        subitems:  [
          new NavigationItemViewModel({
            link: '/flammable.html',
            name: 'Flammable'
          }),
          new NavigationItemViewModel({
            link: '/combustable.html',
            name: 'Combustable'
          }),
          new NavigationItemViewModel({
            link: '/flambustable.html',
            name: 'Flambustable'
          })
        ]
      })
    ]
  })

  document.addEventListener('DOMContentLoaded', function() {
    ko.applyBindings(navigationViewModel, document.querySelector('#mainNavigation'))
    ko.applyBindings(navigationViewModel, document.querySelector('#footerNavigation'))
  })
}(ko))

;(function(ko) {
  'use strict';

  function TalentViewModel(options) {
    var self = this

    self.name = options.name

    self.isActive = ko.observable(false)
  }

  function TalentCalculatorViewModel(options) {
    var self = this;

    self.talentPaths = options.talentPaths

    self.maxActiveTalentCount = options.maxActiveTalentCount

    self.activeTalentCount = ko.computed(function () {
      return self.talentPaths.reduce(function(accumulator, talentPath) {
        return accumulator.concat(talentPath.talents)
      }, []).reduce(function(accumulator, talent) {
        return accumulator + (talent.isActive() ? 1 : 0)
      }, 0)
    })

    function canActivate(talent, talentRow) {
      var requiredTalents = talentRow.slice(0, talentRow.indexOf(talent))
      return self.activeTalentCount() < self.maxActiveTalentCount &&
        talentRow.slice(0, talentRow.indexOf(talent)).every(function(talentReq) {
          return talentReq.isActive()
        })
    }

    self.activate = function(talent, talentRow) {
      if (canActivate(talent, talentRow)) {
        talent.isActive(true)
      }
    }

    self.deactivate = function(talent, talentRow) {
      talentRow.slice(talentRow.indexOf(talent)).forEach(function(dependentTalent) {
        dependentTalent.isActive(false)
      })
    }
  }

  var talentCalculatorViewModel = new TalentCalculatorViewModel({
    maxActiveTalentCount: 6,
    talentPaths: [
      {
        name: 'Talent Path 1',
        className: 'talents--path1',
        talents: [
          new TalentViewModel({ name: 'Talent 1-1' }),
          new TalentViewModel({ name: 'Talent 1-2' }),
          new TalentViewModel({ name: 'Talent 1-3' }),
          new TalentViewModel({ name: 'Talent 1-4' })
        ]
      },
      {
        name: 'Talent Path 2',
        className: 'talents--path2',
        talents: [
          new TalentViewModel({ name: 'Talent 2-1' }),
          new TalentViewModel({ name: 'Talent 2-2' }),
          new TalentViewModel({ name: 'Talent 2-3' }),
          new TalentViewModel({ name: 'Talent 2-4' })
        ]
      }
    ]
  })

  document.addEventListener('DOMContentLoaded', function() {
    ko.applyBindings(talentCalculatorViewModel, document.querySelector('.talentCalculator__widget'))
  })
}(ko))
