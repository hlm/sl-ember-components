/* global module, require */

var mergeTrees = require( 'broccoli-merge-trees' );
var path = require( 'path' );
var pickFiles = require( 'broccoli-static-compiler' );
var slComponentsPath = path.join( 'node_modules', 'sl-components' );

function SlComponents( project ) {
    this.project = project;
    this.name    = 'sl-components';
}

function unwatchedTree( dir ) {
    return {
        cleanup: function () {},
        read:    function () { return dir; }
    };
}

SlComponents.prototype.included = function included( app ) {
    this.app = app;

    app.import( 'vendor/moment/min/moment-with-langs.min.js' );
    app.import( 'vendor/select2/select2.css' );
    app.import( 'vendor/select2/select2.min.js' );
};

SlComponents.prototype.postprocessTree = function ( type, workingTree ) {
    var trees = mergeTrees([
        workingTree,
        pickFiles( path.join( slComponentsPath, 'vendor', 'fontawesome/fonts' ), {
            srcDir: '/',
            files: [
                'fontawesome-webfont.woff'
            ],
            destDir: '/fonts'
        }),
        pickFiles( path.join( slComponentsPath, 'vendor', 'select2' ), {
            srcDir: '/',
            files: [
                'select2.png',
                'select2-spinner.gif'
            ],
            destDir: '/assets'
        })
    ]);

    return trees;
};

SlComponents.prototype.treeFor = function treeFor( name ) {
    if ( name === 'app' ) {
        return pickFiles( path.join( slComponentsPath, 'app' ), {
            srcDir: '/',
            files: [
                'components/*.js',
                'helpers/*.js',
                'mixins/*.js'
            ],
            destDir: '/'
        });
    }

    if ( name === 'styles' ) {
        return unwatchedTree( path.join( slComponentsPath, 'app/styles' ));
    }

    if ( name === 'templates' ) {
        return unwatchedTree( path.join( slComponentsPath, 'app/templates' ));
    }

    if ( name === 'vendor' ) {
        return pickFiles( path.join( slComponentsPath, 'vendor' ), {
            srcDir: '/',
            files: [
                'moment/min/moment-with-langs.min.js',
                'select2/select2.css',
                'select2/select2.min.js'
            ],
            destDir: '/'
        });
    }
};

module.exports = SlComponents;