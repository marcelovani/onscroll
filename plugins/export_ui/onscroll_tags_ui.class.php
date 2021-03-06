<?php

/**
 * @file
 * A custom Ctools Export UI class for DFP Tags.
 */

/**
 * Customizations of the DART Tags UI.
 */
class onscroll_tags_ui extends ctools_export_ui {

  /**
   * Prepare the tag values before they are added to the database.
   */
  function edit_form_submit(&$form, &$form_state) {

    parent::edit_form_submit($form, $form_state);
  }

  /**
   * Build a row based on the item.
   *
   * By default all of the rows are placed into a table by the render
   * method, so this is building up a row suitable for theme('table').
   * This doesn't have to be true if you override both.
   */
  function list_build_row($item, &$form_state, $operations) {
    // Set up sorting
    $name = $item->{$this->plugin['export']['key']};
    $schema = ctools_export_get_schema($this->plugin['schema']);

    // Note: $item->{$schema['export']['export type string']} should have already been set up by export.inc so
    // we can use it safely.
    switch ($form_state['values']['order']) {
      case 'disabled':
        $this->sorts[$name] = empty($item->disabled) . $name;
        break;
      case 'title':
        $this->sorts[$name] = $item->{$this->plugin['export']['admin_title']};
        break;
      case 'name':
        $this->sorts[$name] = $name;
        break;
      case 'storage':
        $this->sorts[$name] = $item->{$schema['export']['export type string']} . $name;
        break;
    }

    $this->rows[$name]['data'] = array();
    $this->rows[$name]['class'] = !empty($item->disabled) ? array('ctools-export-ui-disabled') : array('ctools-export-ui-enabled');

    $this->rows[$name]['data'][] = array('data' => check_plain($item->enabled), 'class' => array('ctools-export-ui-enabled'));
    $this->rows[$name]['data'][] = array('data' => check_plain($item->slot), 'class' => array('ctools-export-ui-slot'));
    $this->rows[$name]['data'][] = array('data' => check_plain($item->machinename), 'class' => array('ctools-export-ui-machinename'));
    $this->rows[$name]['data'][] = array('data' => check_plain($item->campaign_id), 'class' => array('ctools-export-ui-campaign'));
    $this->rows[$name]['data'][] = array('data' => check_plain($item->creative_id), 'class' => array('ctools-export-ui-creative'));
    $this->rows[$name]['data'][] = array('data' => check_plain($item->account_id), 'class' => array('ctools-export-ui-account'));
    $this->rows[$name]['data'][] = array('data' => check_plain($item->mode), 'class' => array('ctools-export-ui-mode'));
    $this->rows[$name]['data'][] = array('data' => check_plain($item->reload), 'class' => array('ctools-export-ui-reload'));

    $this->rows[$name]['data'][] = array(
      'data' => check_plain($item->{$schema['export']['export type string']}),
      'class' => array('ctools-export-ui-storage'),
    );

    $ops = theme('links__ctools_dropbutton', array('links' => $operations, 'attributes' => array('class' => array('links', 'inline'))));

    $this->rows[$name]['data'][] = array(
      'data' => $ops,
      'class' => array('ctools-export-ui-operations'),
    );

    // Add an automatic mouseover of the description if one exists.
    if (!empty($this->plugin['export']['admin_description'])) {
      $this->rows[$name]['title'] = $item->{$this->plugin['export']['admin_description']};
    }
  }

  /**
   * Provide the table header.
   *
   * If you've added columns via list_build_row() but are still using a
   * table, override this method to set up the table header.
   */
  function list_table_header() {
    $header = array();

    $header[] = array('data' => t('Enabled'), 'class' => array('ctools-export-ui-enabled'));
    $header[] = array('data' => t('Ad Slot'), 'class' => array('ctools-export-ui-slot'));
    $header[] = array('data' => t('Machine Name'), 'class' => array('ctools-export-ui-machine-name'));
    $header[] = array('data' => t('Campaign Id'), 'class' => array('ctools-export-ui-campaign'));
    $header[] = array('data' => t('Creative Id'), 'class' => array('ctools-export-ui-creative'));
    $header[] = array('data' => t('Account Id'), 'class' => array('ctools-export-ui-account'));
    $header[] = array('data' => t('Mode'), 'class' => array('ctools-export-ui-mode'));
    $header[] = array('data' => t('Reload'), 'class' => array('ctools-export-ui-reload'));
    $header[] = array('data' => t('Storage'), 'class' => array('ctools-export-ui-reload'));

    return $header;
  }

  /**
   * Make certain that setting form_state['rebuild'] = TRUE in a submit function
   * will correctly rebuild the exportables item edit form for the user. This
   * function is needed until the patch at http://drupal.org/node/1524598 is
   * committed.
   */
  function edit_execute_form_standard(&$form_state) {
    $output = drupal_build_form('ctools_export_ui_edit_item_form', $form_state);

    if (!empty($form_state['executed']) && !$form_state['rebuild']) {
      // Interstitial slots are not displayed as a block.
      if (!empty($form_state['values']['settings']['out_of_page'])) {
        $form_state['item']->block = '0';
      }
      $this->edit_save_form($form_state);
    }
    else {
      unset($form_state['executed']);
    }
    return $output;
  }

  /**
   * Deletes any blocks associated with the exportable item being deleted.
   */
  function delete_page($js, $input, $item) {
    $delta = drupal_strlen(/*'onscroll_' . */$item->machinename) >= 32 ? md5(/*'onscroll_' . */$item->machinename) : /*'onscroll_' . */$item->machinename;
    db_delete('block')
      ->condition('module', 'onscroll')
      ->condition('delta', $delta)
      ->execute();

    return parent::delete_page($js, $input, $item);
  }
}
