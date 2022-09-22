import PropTypes from 'prop-types'

import { isEnterprisePlan, isFreePlan } from 'shared/utils/billing'

function PlanPricing({ value, baseUnitPrice }) {
  if (isFreePlan(value)) {
    return <h2 className="text-4xl">Free</h2>
  }

  if (isEnterprisePlan(value)) {
    return <h2 className="text-4xl">Custom pricing</h2>
  }

  return <h2 className="text-4xl uppercase">${baseUnitPrice}</h2>
}

PlanPricing.propTypes = {
  value: PropTypes.string.isRequired,
  baseUnitPrice: PropTypes.number.isRequired,
}

export default PlanPricing