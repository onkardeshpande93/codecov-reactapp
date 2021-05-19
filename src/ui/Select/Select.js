import PropTypes from 'prop-types'
import { useSelect } from 'downshift'
import identity from 'lodash/identity'
import cs from 'classnames'

import Icon from 'ui/Icon'

const SelectClasses = {
  root: 'w-full relative',
  item: 'block cursor-pointer py-1 px-3 text-sm',
  button:
    'flex justify-between items-center w-full border border-ds-gray-tertiary rounded-md bg-white text-left px-3 outline-none h-8',
  ul: 'overflow-hidden rounded-md bg-white border-ds-gray-tertiary outline-none absolute w-full z-10',
}

function Select({
  placeholder = 'Select',
  items,
  onChange,
  value,
  /* renderItem props:
   *  isHover: boolean
   *  isSelected: boolean
   */
  renderItem = identity,
  /* renderSelected props:
   *  placeholder: string / any
   */
  renderSelected,
  ariaName,
}) {
  const {
    isOpen,
    selectedItem,
    highlightedIndex,
    getToggleButtonProps,
    getMenuProps,
    getItemProps,
  } = useSelect({
    items,
    onSelectedItemChange: ({ selectedItem }) => onChange(selectedItem),
    selectedItem: value ?? null,
  })

  function renderButton() {
    const _render = renderSelected || renderItem
    return (
      _render(selectedItem, {
        placeholder,
      }) || placeholder
    )
  }

  function _renderItem(item, index) {
    const isHover = highlightedIndex === index
    const isSelected = selectedItem === item
    return (
      <li
        className={cs(SelectClasses.item, {
          'bg-ds-gray-secondary': isHover,
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

Select.propTypes = {
  placeholder: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.any,
  renderItem: PropTypes.func,
  renderSelected: PropTypes.func,
  ariaName: PropTypes.string,
}

export default Select