<?php
namespace WP_Table_Builder\Inc\Admin\Element_Classes\Controls;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * WP Table Builder url control.
 *
 * A control class for creating url control for to add tag "a" with href attribute
 * and also to set attributes target and rel="nofollow".
 *
 * @since 1.1.2
 */
class Control_Url extends Base_Control {
    /**
	 * Get control type.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @return string Control type.
	 */
	public function get_type() {
		return 'url';
	}

	/**
	 * Enqueue url control scripts and styles.
	 *
	 * Used to register and enqueue custom scripts and styles used by the url
	 * control.
	 *
	 * @since 1.1.2
	 * @access public
	 */
	public function enqueue() {
        
	}

	/**
	 * Render url control output in the editor.
	 *
	 * Used to generate the control HTML in the editor wp js template
	 *
	 * @since 1.1.2
	 * @access public
	 */
	public function content_template() {
		?>
        <#  
            let label,
                selector,
                dataElement;
            
            if( data.label ) {
                label = data.label;
            }
            
            if( data.selector ) {
                selector = data.selector;
            }
            
            if( selector ) {
                let selectorArr = selector.replace( '.', '' ).split( ' ' );
                let infArr = selectorArr[0].match( /wptb-element-((.+-)\d+)/i );
                let dataElement = 'wptb-options-' + infArr[1];
            }
            
            targetInputAddClass = data.elementControlTargetUnicClass;
            let postfixIdFor = targetInputAddClass.replace( 'wptb-el', '' ).toLowerCase();
        #>
        
        <div class="wptb-settings-item-header">
            <p class="wptb-settings-item-title">{{{label}}}</p>
        </div>
        <div class="wptb-settings-row wptb-settings-middle-xs" style="padding-bottom: 10px">
            <div class="wptb-settings-col-xs-8" style="margin: 15px 0;">
                <input type="text" data-type="element-link" placeholder="Insert Link Here" 
                       class="wptb-element-property {{{targetInputAddClass}}}" data-element="{{{dataElement}}}">
            </div>
            <div class="wptb-settings-col-xs-8">
                <input type="checkbox" data-type="element-link-target" id="element-link-target{{{postfixIdFor}}}"
                       class="wptb-element-property {{{targetInputAddClass}}}" data-element="{{{dataElement}}}">
                <label for="element-link-target{{{postfixIdFor}}}">Open Link in New Tab</label>
            </div>
            <div class="wptb-settings-col-xs-8">
                <input type="checkbox" data-type="element-link-nofollow" id="element-link-nofollow{{{postfixIdFor}}}" 
                       class="wptb-element-property {{{targetInputAddClass}}}" data-element="{{{dataElement}}}">
                <label for="element-link-nofollow{{{postfixIdFor}}}">Nofollow Link</label>
            </div>
        </div>   
        
        <wptb-template-script>
            ( function() {
                let selectorElement = document.querySelector( '{{{selector}}}' );
                let targetInputs = document.getElementsByClassName( '{{{targetInputAddClass}}}' );
                for( let i = 0; i < targetInputs.length; i++ ) {
                    if( targetInputs[i].dataset.type == 'element-link' ) {
                        let href = selectorElement.getAttribute( 'href' );
                        targetInputs[i].value = href;

                        targetInputs[i].onchange = function() {
                            if ( this.value ) {
                                selectorElement.href = WPTB_Helper.linkHttpCheckChange( this.value );
                            } else {
                                selectorElement.removeAttribute( 'href' );
                            }
                            
                            let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
                            wptbTableStateSaveManager.tableStateSet();
                        }
                    } else if( targetInputs[i].dataset.type == 'element-link-target' ) {
                        let linkTarget = selectorElement.getAttribute( 'target' );
                        if( ! linkTarget || linkTarget == '_self' ) {
                            targetInputs[i].checked = false;
                        } else if( linkTarget == '_blank' ) {
                            targetInputs[i].checked = true;
                        }
                        
                        targetInputs[i].onchange = function() {
                            if (this.checked == true) {
                                selectorElement.target = '_blank';
                            } else {
                                selectorElement.target = '_self';
                            }
                            
                            let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
                            wptbTableStateSaveManager.tableStateSet();
                        }
                    } else if( targetInputs[i].dataset.type == 'element-link-nofollow' ) {
                        let linkRel = selectorElement.getAttribute( 'rel' );
                        if( linkRel && linkRel == 'nofollow' ) {
                            targetInputs[i].checked = true;
                        } else {
                            targetInputs[i].checked = false;
                        }
                        targetInputs[i].onchange = function() {
                            if ( this.checked == true ) {
                                selectorElement.rel = 'nofollow';
                            } else {
                                selectorElement.removeAttribute( 'rel' );
                            }
                            
                            let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
                            wptbTableStateSaveManager.tableStateSet();
                        }
                    }
                } 
            } )();
        </wptb-template-script>
        
		<?php
	}
}