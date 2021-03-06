/********************************************************************************
 *  Copyright notice
 *
 *  (c) 2014 Christoph Taubmann (info@cms-kit.org)
 *  All rights reserved
 *
 *  This script is part of cms-kit Framework.
 *  This is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License Version 3 as published by
 *  the Free Software Foundation, or (at your option) any later version.
 *
 *  The GNU General Public License can be found at
 *  http://www.gnu.org/licenses/gpl.html
 *
 *  This script is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  This copyright notice MUST APPEAR in all copies of the script!
 *
 *
 *********************************************************************************/

/**
 * simple function to check changes of the hash (= browser-history)
 * name: checkHash
 *
 */
function checkHash()
{
    var h = window.location.hash.substr(1);

    if (h.length > 0)
    {
        //store['lastPage']=h;
        var p = h.split('&');

        for(var i=0,j=p.length;i<j;++i)
        {
            var a = p[i].split('=');
            if(a[1])
            {
                g[a[0]] = a[1];
            }
        }
    };

    if (!g['id'])
    {
        $('#colMidb').empty();
        $('#colRightb').empty();
    };

    if (g['id'] && g['id']!=objectId)
    {
        getContent(g['id'])
    };

    window.setTimeout(checkHash, 3000);
};
