<?php

/**
 * @file
 * Context reaction plugin for onscroll Out of page.
 */

/**
 * Expose onscroll Out of page as context reactions.
 */
class onscroll_context_reaction_outofpage extends context_reaction {
  /**
   * Allow admins to choose what tags show.
   */
  function options_form($context) {
    // Get existing values for this form.
    $values = $this->fetch_from_context($context);

    // Get a list of tags.
    $options = array();
    $tags = onscroll_tag_load_all();
    foreach ($tags as $tag) {
      if (!empty($tag->settings['out_of_page'])) {
        $options[$tag->machinename] = $tag->slot;
      }
    }

    $form = array(
      '#title' => t('Show these onscroll Out of page tags'),
      '#description' => t('The following onscroll tags will be added to the page.'),
      '#default_value' => isset($values) ? $values : array(),
    );
    if (!empty($options)) {
      $form['#type'] = 'checkboxes';
      $form['#options'] = $options;
    }
    else {
      $form['#markup'] = t(
        'There are no "Out of page" slots available. You can create them on the !link page.',
        array(
          '!link' => l(t('onscroll Ad Tags'), 'admin/structure/onscroll_ads', array('html' => TRUE)),
        )
      );
    }

    return $form;
  }

  /**
   * Disable any tags that should be disabled based on context.
   */
  function execute() {
    // Check each currently set context to see if the onscroll tag specified by
    // machinename should be displayed or not.
    foreach ($this->get_contexts() as $context_name => $context) {
      if (isset($context->reactions['onscroll_outofpage'])) {
        foreach ($context->reactions['onscroll_outofpage'] as $key => $value) {
          if (!empty($value)) {
            $this->out_of_page_tags[$key] = $value;
          }
        }
        break;
      }
    }
  }
}
