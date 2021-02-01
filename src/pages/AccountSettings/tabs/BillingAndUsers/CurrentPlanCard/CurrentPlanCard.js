import { Link } from 'react-router-dom'

import Button from 'ui/Button'
import Card from 'ui/Card'
import githubLogo from 'assets/githublogo.png'
import { useBaseUrl } from 'shared/router'

import { accountDetailsPropType } from 'services/account'

import BenefitList from '../../../shared/BenefitList'

function shouldRenderCancelLink(accountDetails, isFreePlan) {
  // cant cancel a free plan
  if (isFreePlan) return false

  // plan is already set for cancellation
  if (accountDetails.subscriptionDetail?.cancelAtPeriodEnd) return false

  return true
}

function CurrentPlanCard({ accountDetails }) {
  const isFreePlan = accountDetails.plan.value === 'users-free'
  const baseUrl = useBaseUrl()

  return (
    <Card className="px-12 py-10 pb-4 mb-4">
      <h3 className="text-lg text-pink-500 font-bold">
        {accountDetails.plan.marketingName}
      </h3>
      <h2 className="text-4xl uppercase">
        {isFreePlan ? 'Free' : `$${accountDetails.plan.baseUnitPrice}`}
      </h2>
      <div className="mt-8 text-sm border-gray-200">
        <BenefitList
          iconName="check"
          iconColor="text-pink-500"
          benefits={accountDetails.plan.benefits}
        />
      </div>
      <hr className="my-6" />
      <p className="mt-4">
        {accountDetails.activatedUserCount} / {accountDetails.plan.quantity}{' '}
        Active users
      </p>
      <p className="mt-3 text-codecov-red font-bold" data-test="inactive-users">
        {accountDetails.inactiveUserCount} Inactive users
      </p>

      <div className="flex flex-col items-center mt-6">
        {accountDetails.planProvider === 'github' ? (
          <div className="border-t border-gray-200 pb-4">
            <p className="mt-4 mb-6 flex items-center text-sm">
              <img
                className="block mr-4"
                alt="Github"
                src={githubLogo}
                height={32}
                width={32}
              />
              Your account is configured via GitHub Marketplace
            </p>
            <div className="text-center">
              <Button
                Component="a"
                href="https://github.com/marketplace/codecov"
              >
                Manage billing in GitHub
              </Button>
            </div>
          </div>
        ) : (
          <>
            <Button Component={Link} to={`${baseUrl}upgrade`}>
              {isFreePlan ? 'Upgrade plan to pro' : 'Change plan'}
            </Button>
            {shouldRenderCancelLink(accountDetails, isFreePlan) && (
              <Button
                to={`${baseUrl}cancel`}
                Component={Link}
                variant="text"
                color="gray"
                className="mt-4"
              >
                Cancel Plan
              </Button>
            )}
          </>
        )}
      </div>
    </Card>
  )
}

CurrentPlanCard.propTypes = {
  accountDetails: accountDetailsPropType.isRequired,
}

export default CurrentPlanCard
