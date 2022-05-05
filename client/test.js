var grades = {
    linearAlgebra : 90,
    chemistry : 95,
    biology :90,
    languages : 96
 };

Object.filter = function(mainObject, filterFunction){
    return Object.keys(mainObject)
          .filter( function(ObjectKey){
              return filterFunction(mainObject[ObjectKey])
          } )
          .reduce( function (result, ObjectKey){
              result[ObjectKey] = mainObject[ObjectKey];
              return result;
            }, {} );
}
// obj faiblesse
Object.keys(faiblesse)
.filter((obj) => (faiblesse) => faiblesse[obj]> 1)
.reduce((result, ) => )

var targetSubjects = Object.filter(grades, function(grade){
    return grade>=95;
});