<?php

/**
 * @file
 * A Ctools Export UI plugin for OnScroll ads.
 */

/**
 * Define this Export UI plugin.
 */
$plugin = array(
  'schema' => 'onscroll_tags',
  'access' => 'administer onscroll',

  // Define the menu item.
  'menu' => array(
    'menu item' => 'onscroll',
    'menu prefix' => 'admin/config/system',
    'menu title' => 'Onscroll',
    'menu description' => 'Create and manage your Onscroll ad tags.',
  ),

  // Define user interface texts.
  'title singular' => t('Onscroll ad'),
  'title plural' => t('Onscroll ads'),
  'title singular proper' => t('Onscroll ad'),
  'title plural proper' => t('Onscroll ads'),

  // Define the class to use as a handler for DFP ad tags.
  'handler' => array(
     'class' => 'onscroll_tags_ui',
     'parent' => 'ctools_export_ui',
  ),

  // Define the names of the functions that provide the add/edit forms.
  'form' => array(
    'settings' => 'onscroll_ctools_export_ui_form',
    'validate' => 'onscroll_tags_form_validate',
  ),
);

/**
 * Form builder; Create an ad tag.
 */
function onscroll_ctools_export_ui_form(&$form, &$form_state) {
  // Make sure that all the necessary files are included even on ajax callbacks.
  form_load_include($form_state, 'inc', 'onscroll', 'plugins/export_ui/onscroll_ctools_export_ui');

  // We load the name of the export from url.
  $name = array(arg(5));
  // Create a default tag object based on either a new or current export object.
  $tag = ($form_state['op'] == 'add' ? $form_state['item'] : current(ctools_export_load_object('onscroll_tags','names',$name)));
  $form['onscroll_global'] = array(
    '#type' => 'fieldset',
    '#title' => t('Global Settings'),
  );

  $form['onscroll_global']['enabled'] = array(
    '#type' => 'checkbox',
    '#title' => t('OnScroll Enabled'),
    '#default_value' => $tag->enabled,
  );

  $form['onscroll_global']['url'] = array(
    '#type' => 'textfield',
    '#title' => t('OnScroll URL'),
    '#default_value' => $tag->url,
    '#value' => $form_state['op'] == 'add' ? ONSCROLL_URL : $form_state['item']->url,
  );

  $dfp_description = '';
  $options =  array('custom' => t('Custom'));
  if (module_exists('dfp')) {
    $dfp_description = ' ' . t('Or you can choose one of the DFP slots.');
    $tags = dfp_tag_load_all();
    foreach ($tags as $dfp_tag) {

      $options += array($dfp_tag->machinename => $dfp_tag->slot);
    }
  }
  $form['onscroll_global']['slot'] = array(
    '#type' => 'select',
    '#title' => t('Ad slot'),
    '#options' =>$options,
    '#default_value' => $tag->slot,
    '#description' => t('You can paste the Ad code here.') . $dfp_description,
  );
  $form['onscroll_global']['machinename'] = array(
      '#type' => 'machine_name',
      '#title' => t('Unique Name'),
      '#maxlength' => 128,
      '#default_value' => $tag->machinename,
      '#description' => t('Only use letters, numbers and underscores. Example: top-banner'),
      '#machine_name' => array(
        'exists' => 'onscroll_tags_name_exists',
        'source' => array('global', 'ad_slot'),
      ),
    );

  $form['onscroll_global']['code'] = array(
    '#type' => 'textarea',
    '#title' => t('OnScroll Code'),
    '#description' => t('Paste the Ad code here.'),
    '#default_value' => $tag->code,
    '#states' => array(
      'visible' => array('select[name="ad_slot"]' => array('value' => 'custom')),
    ),
  );

  $form['global']['campaign_id'] = array(
    '#type' => 'textfield',
    '#title' => t('Campaign Id'),
    '#size' => '25',
    '#default_value' => $tag->campaign_id,
  );

  $form['global']['creative_id'] = array(
    '#type' => 'textfield',
    '#title' => t('Creative Id'),
    '#size' => '25',
    '#default_value' => $tag->creative_id,
  );

  $form['global']['account_id'] = array(
    '#type' => 'textfield',
    '#title' => t('Account Id'),
    '#size' => '25',
    '#default_value' => $tag->account_id,
  );

  $form['options'] = array(
    '#type' => 'fieldset',
    '#title' => t('OnScroll Options'),
  );

  $form['options']['mode'] = array(
    '#type' => 'select',
    '#title' => t('Mode'),
    '#options' => array(
      'basic' => t('Basic'),
      'sticky' => t('Sticky'),
      'sticky_reappearing' => t('Sticky Reappearing'),
      'sticky_dual' => t('Sticky Dual'),
    ),
    '#default_value' => $tag->mode,
  );

  $form['options']['js_interval'] = array(
    '#type' => 'textfield',
    '#title' => t('Interval'),
    '#maxlength' => 4,
    '#size' => '4',
    '#default_value' => $tag->js_interval,
  );

  $form['options']['reload'] = array(
    '#type' => 'checkbox',
    '#title' => t('Reload'),
    '#default_value' => $tag->reload,
  );

  $form['dimensions'] = array(
    '#type' => 'fieldset',
    '#title' => t('Dimensions'),
  );

  $form['dimensions']['margin'] = array(
    '#type' => 'textfield',
    '#title' => t('Margin'),
    '#maxlength' => 4,
    '#size' => 4,
    '#default_value' => $tag->margin,
  );

  $form['dimensions']['margin_top'] = array(
    '#type' => 'textfield',
    '#title' => t('Top margin'),
    '#maxlength' => 4,
    '#size' => 4,
    '#default_value' => $tag->margin_top,
  );

  $form['dimensions']['height'] = array(
    '#type' => 'textfield',
    '#title' => t('Height (Pixels)'),
    '#maxlength' => 4,
    '#size' => 4,
    '#default_value' => $tag->height,
  );

  $form['dimensions']['width'] = array(
    '#type' => 'textfield',
    '#title' => t('Width (Pixels)'),
    '#maxlength' => 4,
    '#size' => 4,
    '#default_value' => $tag->width,
  );

}

/**
 * Form validation for the dfp_ad_tag form.
 */
function onscroll_tags_form_validate(&$form, &$form_state) {
  // Ad Unit names can only have letters, numbers and slashes.¬
  if (preg_match('@[^a-zA-Z0-9\/\-_\.\[\]\:]+@', $form_state['values']['machinename'])) {
    form_set_error('machinename', t('Ad Unit Patterns can only include letters, numbers, hyphens, dashes, periods, slashes and tokens.'));
  }
}

/**
 * Check if the given machinename is unique in the dfp_tags table.
 */
function onscroll_tags_name_exists($machinename) {
  $select = db_select('onscroll_tags', 'dt');
  $select->addExpression('COUNT(*)');
  $select->condition('dt.machinename', $machinename);

  return $select->execute()->fetchField();
}
