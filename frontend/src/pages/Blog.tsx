function Blog() {

const posts=[
"How AI is changing career planning",
"Top skills for software engineers",
"Resume mistakes students make"
];


return(
<div className="min-h-screen px-6 py-20">

<h1 className="text-5xl font-bold">
CareerPilot AI Blog
</h1>


<div className="mt-10 grid md:grid-cols-3 gap-6">

{posts.map(post=>(
<div
key={post}
className="bg-white/10 p-6 rounded-2xl"
>
<h2 className="text-xl font-bold">
{post}
</h2>

<p className="mt-3 text-gray-300">
Read more about career growth and technology.
</p>

</div>
))}

</div>

</div>
)

}

export default Blog;