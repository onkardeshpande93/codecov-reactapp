import PropTypes from 'prop-types'
import { useSelect } from 'downshift'
import identity from 'lodash/identity'
import cs from 'classnames'
import pluralize from 'pluralize'

import Icon from 'ui/Icon'

const SelectClasses = {
  root: 'w-full relative',
  item: 'block cursor-pointer py-1 px-3 text-sm',
  button:
    'flex justify-between items-center w-full border border-ds-gray-tertiary rounded-md bg-white text-left px-3 outline-none h-8',
  ul: 'overflow-hidden rounded-md bg-white border-ds-gray-tertiary outline-none absolute w-full z-10',
}

function MultiSelect({
  resourceName = 'flag',
  items,
  onChange,
  selectedItems,
  renderItem = identity,
  renderSelected,
  ariaName,
}) {
  const {
    isOpen,
    highlightedIndex,
    getToggleButtonProps,
    getMenuProps,
    getItemProps,
  } = useSelect({
    items,
    onSelectedItemChange: ({ selectedItem }) => {
      const newSet = selectedItems.includes(selectedItem)
        ? selectedItems.filter((item) => item !== selectedItem)
        : [...selectedItems, selectedItem]
      onChange(newSet)
    },
    selectedItem: null,
  })

  function renderButton() {
    return selectedItems.length === 0
      ? `All ${pluralize(resourceName)} selected`
      : `${pluralize(resourceName, selectedItems, true)} selected`
  }

  function _renderItem(item, index) {
    const isHover = highlightedIndex === index
    const isSelected = selectedItems.includes(item)
    return (
      <li
        className={cs(SelectClasses.item, {
          'bg-ds-gray-secondary': isHover,
          'border-l-2 border-ds-gray-octonary font-bold': isSelected,
        })}
        key={`${item}${index}`}
        {...getItemProps({ item, index })}
      >
        {renderItem(item, { isHover, isSelected })}
      </li>
    )
  }

  return (
    <div className={SelectClasses.root}>
      <button
        aria-label={ariaName}
        type="button"
        className={SelectClasses.button}
        {...getToggleButtonProps()}
      >
        {renderButton()}
        <Icon variant="solid" name={isOpen ? 'chevron-up' : 'chevron-down'} />
      </button>
      <ul
        aria-label={ariaName}
        className={cs(SelectClasses.ul, {
          border: isOpen,
          'border-gray-ds-tertiary': isOpen,
        })}
        {...getMenuProps()}
      >
        {isOpen && items.map(_renderItem)}
      </ul>
    </div>
  )
}

MultiSelect.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
  onChange: PropTypes.func.isRequired,
  selectedItems: PropTypes.arrayOf(PropTypes.any).isRequired,
  renderItem: PropTypes.func,
  renderSelected: PropTypes.func,
  ariaName: PropTypes.string,
  resourceName: PropTypes.string.isRequired,
}

export default MultiSelect
